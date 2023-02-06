<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { navigate } from 'svelte-navigator';
    import { api, WS_BASE_URL } from '@api/api';
    import { Failure, Info, Success, Warning } from '@lib/notify/notify';
    import {
        NoteState,
        type ConnectMsg,
        type GetJamData,
        type MIDIMsg,
        type TextMsg,
    } from '@lib/types/jam';
    import { WSMsgTyp, type WSMsg } from '@lib/types/websocket';
    import { JamStore, JamTextStore } from '@store/jam';
    import { UserStore } from '@store/user';

    import Icon from '@lib/components/global/Icon.svelte';
    import Chat from '@lib/components/jam/Chat.svelte';
    import Piano from '@lib/components/jam/Piano.svelte';
    import { pingStats } from '@store/ping';
    import { handleIncomingMIDI, noteHandler } from '@lib/components/jam/midi';
    import {
        autoCorrelate,
        meter,
        noteFromPitch,
    } from '@lib/components/jam/mic';
    import { Envelope } from '@lib/envelope/envelope';
    import DeviceSelect from '@lib/components/jam/DeviceSelect.svelte';

    export let jamID: string;
    let midi: MIDIMsg;
    let micOn: boolean = false;
    let micInit: boolean = false;

    /*-------------------Audio related code---------------------*/

    let audioContext: AudioContext = null;
    let analyser: AnalyserNode = null;
    let mediaStream: MediaStream = null;
    let micInput: MediaStreamAudioSourceNode = null;
    let sensitivity = 0.05;
    const octaveLength = 12;
    let pitch = 0;
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
        analyser = audioContext.createAnalyser();
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 2048;

        micInput.connect(analyser);
        updatePitch();
    }

    let bufLen = 2048;
    let buf = new Float32Array(bufLen);

    function updatePitch() {
        meter(analyser);

        analyser.getFloatTimeDomainData(buf);
        let ac = autoCorrelate(buf, audioContext.sampleRate, sensitivity);
        if (ac != -1) {
            pitch = ac;
            let noteNum = noteFromPitch(pitch, octaveLength);
            if (noteNum !== noteHistory[noteHistory.length - 1]) {
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

                sendWSMsg(msg);
            }
        }
        requestAnimationFrame(updatePitch);
    }

    function initMic() {
        audioContext = new (window.AudioContext ||
            globalThis.webkitAudioContext)();
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
            const { data } = await api.get<GetJamData>(`/jam/${jamID}`);
            JamStore.update((store) => ({
                ...store,
                ...data,
                players: [],
                ws: new WebSocket(`${WS_BASE_URL}/jam/${jamID}`),
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
                JamTextStore.update((items) => [
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

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="jam page">
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
                <Piano
                    on:INSTRUMENT_NOTE={noteHandler(
                        $JamStore.ws,
                        $UserStore.userId
                    )} />
            {/if}
        </div>
        <div class="jam-extras">
            <Chat />
        </div>
    </div>
    <div class="jam-controls-con">
        {#if micOn}
            <DeviceSelect bind:selected={audioDevice} />
        {/if}
        <div class="jam-controls">
            <div class="input">
                <button
                    class="btn"
                    type="button"
                    on:click={toggleMic}
                    ><Icon name={micOn ? 'mic' : 'mic-off'} /></button>
                <button
                    class="btn"
                    type="button"
                    on:click={togglePiano}><Icon name="music" /></button>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .jam {
        display: flex;
        flex-direction: column;
        background-color: #fff;

        & > div {
            width: 100%;
        }

        .jam-content {
            height: 100%;
            display: flex;

            & > div {
                height: 100%;
            }

            .jam-extras {
                width: 30rem;
                display: flex;
                flex-direction: column;
                padding: 1rem;
            }

            .jam-player {
                width: 100%;
                display: flex;
                flex-direction: column;
                padding: 1rem;
                overflow: auto;

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

            .jam-controls {
                width: 100%;
                height: 5rem;
                display: flex;
                align-items: center;
                justify-content: space-around;
                border-radius: 0.5rem;

                & > div {
                    height: 100%;
                    display: flex;
                    align-items: center;
                }

                .input {
                    & > button {
                        border-radius: 100%;
                        font-size: 1rem;
                        padding: 1rem;
                        margin: 0.5rem;
                    }
                }
            }
        }
    }
</style>
