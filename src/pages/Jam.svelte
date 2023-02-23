<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { navigate } from 'svelte-navigator';
    import { api, createWebsocket } from '@api/api';
    import { Failure, Info, Success, Warning } from '@lib/notify/notify';
    import {
        NoteState,
        type ConnectMsg,
        type GetJamData,
        type MIDIMsg,
        type TextMsg,
    } from '@lib/types/jam';
    import { WSMsgTyp, type WSMsg } from '@lib/types/websocket';
    import { JamStore } from '@store/jam';
    import { UserStore } from '@store/user';
    import Icon from '@lib/components/global/Icon.svelte';
    import Chat from '@lib/components/jam/Chat.svelte';
    import Piano from '@lib/components/jam/Piano.svelte';
    import { pingStats } from '@store/ping';
    import { Envelope } from '@lib/envelope/envelope';
    import DeviceSelect from '@lib/components/jam/DeviceSelect.svelte';
    import Settings from '@lib/components/jam/modals/Settings.svelte';
    import { ChatStore } from '@store/chat';
    import { freqAnalyze, noteFromPitch } from '@lib/services/jam/mic';
    import { handleIncomingMIDI } from '@lib/services/jam/midi';
    import Button from '@lib/components/global/Button.svelte';
    import Page from '@lib/components/global/Page.svelte';

    export let jamID: string;
    let midi: MIDIMsg;
    let micOn: boolean = false;
    let micInit: boolean = false;

    /*-------------------Audio related code---------------------*/

    let audioContext: AudioContext = null;
    let analyser: AnalyserNode = null;
    let mediaStream: MediaStream = null;
    let micInput: MediaStreamAudioSourceNode = null;
    // Integer (0-255) representing the minimum level of the audio input to return true.
    let sensitivity = 140;
    const octaveLength = 12;
    let noteHistory: number[] = [];
    const historyLength = 2;

    let audioDevice: MediaDeviceInfo;
    $: handleDeviceSelect(audioDevice);

    function handleDeviceSelect(device?: MediaDeviceInfo) {
        if (!device) {
            console.warn('No device selected');
            return;
        }
        getUserMedia(device.deviceId);
    }

    async function getUserMedia(deviceId?: string) {
        navigator.mediaDevices
            .getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                    deviceId,
                },
                video: false,
            })
            .then((stream) => {
                mediaStream = stream;
                gotStream();
            })
            .catch((err) => {
                alert('getUserMedia threw exception:' + err);
                micInit = false;
            });
    }

    function gotStream() {
        micInput = audioContext.createMediaStreamSource(mediaStream);
        analyser = new AnalyserNode(audioContext);

        micInput.connect(analyser);
        updatePitch();
    }

    function updatePitch() {
        // TODO: Not working as expected
        const { thresholdMet, loudestFreq } = freqAnalyze(
            analyser,
            sensitivity,
            false
        );
        if (!thresholdMet) {
            requestAnimationFrame(updatePitch);
            return;
        }
        // This explicit type should not be necessary, but TS is not picking up the possible null from
        // noteFromPitch() return type def....
        const noteNum: number | null = noteFromPitch(loudestFreq, octaveLength);
        if (!noteNum || noteNum === noteHistory[noteHistory.length - 1]) {
            requestAnimationFrame(updatePitch);
            return;
        }

        if (noteHistory.length === historyLength) {
            noteHistory.shift();
        }
        noteHistory = [...noteHistory, noteNum];
        // FIXME: still sends repeated notes.
        // send new note to websocket
        const midi: MIDIMsg = {
            state: NoteState.NOTE_ON,
            number: noteNum,
            velocity: 127,
        };

        const msg = new Envelope<MIDIMsg>(
            $UserStore.userId,
            WSMsgTyp.MIDI,
            midi
        );

        console.log(loudestFreq);

        sendWSMsg(msg);
        requestAnimationFrame(updatePitch);
    }

    function initMic() {
        audioContext = new (window.AudioContext ||
            globalThis.webkitAudioContext)({ latencyHint: 'interactive' });
        getUserMedia()
            .then(() => {
                micInit = true;
            })
            .catch((err: Error) => {
                micInit = false;
                Failure(err.message);
            });
    }

    /*^^^^^^^^^^^^^^^^^^- Audio related code -^^^^^^^^^^^^^^^^^*/

    const unsubscribe = pingStats.subscribe((value) => {
        console.log(value);
    });

    function toggleMic() {
        if (!micInit) {
            initMic();
        }

        micOn = !micOn;

        if (mediaStream) {
            mediaStream.getAudioTracks().forEach((track) => {
                track.enabled = micOn;
            });
        }
    }

    let showPiano: boolean = false;
    function togglePiano() {
        showPiano = !showPiano;
    }

    async function initJam() {
        try {
            const { data } = await api.get<GetJamData>(`/jams/${jamID}`);
            JamStore.update((store) => ({
                ...store,
                ...data,
                players: [],
                ws: createWebsocket(`/jams/${jamID}/ws`),
            }));
            Success('Jam data loaded');
        } catch (err) {
            Failure(err.message);
            navigate('/', { replace: true });
        }
    }

    function sendWSMsg(msg: Envelope<ConnectMsg | MIDIMsg | TextMsg>) {
        $JamStore.ws.send(msg.json());
    }

    function handleWSMsg(msg: WSMsg<ConnectMsg | MIDIMsg | TextMsg>) {
        pingStats.msgIn(msg.id);

        switch (msg.type) {
            case WSMsgTyp.TEXT:
                let displayMsg = msg.payload as TextMsg;
                if (msg.userId === $UserStore.userId) {
                    displayMsg.displayName = 'You';
                }
                ChatStore.update((items) => [
                    ...items,
                    { ...msg, payload: displayMsg },
                ]);
                break;
            case WSMsgTyp.MIDI:
                handleIncomingMIDI(msg as WSMsg<MIDIMsg>);
                midi = msg.payload as MIDIMsg;
                break;
            case WSMsgTyp.CONNECT:
                const { userId, userName } = msg.payload as ConnectMsg;
                UserStore.set({
                    userId,
                    userName,
                });
                break;
            default:
                console.warn('Unknown message type', msg);
                Warning('Unknown message type');
        }
    }

    onMount(async () => {
        await initJam();

        $JamStore.ws.onopen = () => {
            Success('Connection established.');
        };
        $JamStore.ws.onmessage = (event: MessageEvent) => {
            let msg: WSMsg<any> = JSON.parse(event.data);
            handleWSMsg(msg);
        };
        $JamStore.ws.onerror = (event: ErrorEvent) => {
            Failure(event.error);
            $JamStore.ws.close();
        };
        $JamStore.ws.onclose = () => {
            Info('Connection was closed.');
        };
    });

    let showChat: boolean = false;
    function toggleChat() {
        showChat = !showChat;
    }

    let showSettings: boolean = false;
    function toggleSettings() {
        showSettings = !showSettings;
    }

    onDestroy(() => {
        unsubscribe();
    });
</script>

<Page class="jam">
    <div class="jam-content">
        <div class="jam-player">
            <div class="messages">
                {#if midi}
                    <p>{midi.number}</p>
                {:else}
                    <p>No message available</p>
                {/if}
            </div>
            {#if showPiano}
                <Piano />
            {/if}
        </div>
        <div class="jam-extras">
            {#if showChat}
                <Chat />
            {/if}
        </div>
    </div>
    <div class="jam-controls-con">
        {#if micOn}
            <DeviceSelect bind:selected={audioDevice} />
        {/if}
        <div class="jam-controls">
            <div class="ping">
                <div class="ping-stats">
                    <p><b>ping</b>: {$pingStats.avg.toFixed()} <i>ms</i></p>
                </div>
            </div>
            <div class="input">
                <Button
                    type="button"
                    on:click={toggleMic}
                    ><Icon name={micOn ? 'mic' : 'mic-off'} /></Button>
                <Button
                    type="button"
                    on:click={togglePiano}><Icon name="music" /></Button>
                <Button
                    type="button"
                    on:click={toggleSettings}><Icon name="settings" /></Button>
            </div>
            <div class="chat">
                <Button
                    type="button"
                    on:click={toggleChat}>
                    <Icon name="message-square" />
                </Button>
            </div>
        </div>
    </div>
    {#if showSettings}
        <Settings closeFunc={toggleSettings} />
    {/if}
</Page>

<style lang="scss">
    :global(.jam) {
        display: flex;
        flex-direction: column;

        & > div {
            width: 100%;
        }

        .jam-content {
            height: 100%;
            display: flex;
            overflow: hidden;

            & > div {
                height: 100%;
            }

            .jam-extras {
                display: flex;
                flex-direction: column;
                padding: 1rem;
            }

            .jam-player {
                width: 100%;
                display: flex;
                flex-direction: column;
                padding: 1rem;
                overflow: hidden;

                .messages {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: auto;

                    & > p {
                        background-color: #000;
                        padding: 1rem 3rem;
                        color: #fff;
                        font-size: 2rem;
                        border-radius: 0.5rem;
                    }
                }
            }
        }

        .jam-controls-con {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;

            .jam-controls {
                width: 100%;
                height: 5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 0.5rem;
                padding: 0 1rem;

                & > div {
                    height: 100%;
                    display: flex;
                    align-items: center;
                }

                .ping {
                    justify-content: flex-start;
                    .ping-stats {
                        border-radius: var(--border-radius);
                        background-color: var(--background-accent);
                        padding: 1rem;

                        p > b {
                            color: var(--primary);
                        }
                    }
                }

                .input {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    justify-content: center;

                    :global(button) {
                        border-radius: 100%;
                        margin: 0.5rem;
                    }
                }

                .chat {
                    justify-content: flex-end;

                    :global(button) {
                        border-radius: 100%;
                        margin: 0.5rem;
                    }
                }
            }
        }
    }
</style>
