<script lang="ts">
    // TODO -- I would like to ask why we are importing so much, try and reduce this
    import { onDestroy, onMount } from 'svelte';
    import { agent } from '@api/api';
    import { Failure, Info, Success, Warning } from '@lib/notify/notify';
    import { JamStore } from '@store/jam';
    import { UserStore } from '@store/user';
    import Icon from '@lib/components/global/Icon.svelte';
    import Chat from '@lib/components/jam/Chat.svelte';
    import Piano from '@lib/components/jam/Piano.svelte';
    import { pingStats } from '@store/ping';
    import DeviceSelect from '@lib/components/jam/DeviceSelect.svelte';
    import Settings from '@lib/components/jam/modals/Settings.svelte';
    import { ChatStore } from '@store/chat';
    import { freqAnalyze, noteFromPitch } from '@lib/services/jam/mic';
    import { handleIncomingMIDI } from '@lib/services/jam/midi';
    import Button from '@lib/components/global/Button.svelte';
    import Page from '@lib/components/global/Page.svelte';
    import { MessageParser } from '@lib/services/parser/message';
    import type { Message, Payload } from '@lib/types/message';
    import { createToggle } from '@store/toggle';

    export let jamID: string;
    let midi: Payload<'midi'>;
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
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                    deviceId,
                },
                video: false,
            });

            gotStream();
        } catch (error) {
            alert('getUserMedia threw exception:' + error);
            micInit = false;
        }
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
        // TODO -- `sendMsg` got in the way, will want to update this
        // logic anyhow though
        {
            // let raw = MessageParser.encode($UserStore.userId, 'midi', {
            let raw = MessageParser.encode($UserStore.userId, 'midi', {
                state: 1,
                number: noteNum,
                velocity: 127,
            });
            $JamStore.ws.send(raw);
        }
        console.log(loudestFreq);
        requestAnimationFrame(updatePitch);
    }

    async function initMic() {
        // TODO -- this can be done at the variable declaration level
        // easier to track
        audioContext = new (window.AudioContext ||
            globalThis.webkitAudioContext)({ latencyHint: 'interactive' });
        try {
            await getUserMedia();
            micInit = true;
        } catch (err) {
            micInit = false;
            Failure(err.message);
            return;
        }
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

    async function initJam() {
        try {
            const { data } = await agent.jams.get(jamID);
            JamStore.update((store) => ({
                ...store,
                ...data,
                players: [],
                ws: agent.jams.ws(jamID),
            }));
            Success('Jam data loaded');
        } catch (err) {
            Failure(err.message);
            agent.redirect.home();
        }
    }

    function handleWSMsg(message: Message) {
        pingStats.msgIn(message.id);

        switch (message.type) {
            case 'text': {
                let displayMsg = message.payload; //as TextMsg;
                if (message.userId === $UserStore.userId) {
                    displayMsg.displayName = 'You';
                }

                // TODO -- inside `store/chat` I omitted the type just to get this to pass
                // make a wrapper around the store, so this api is cleaner, something like:
                // ChatStore.update(messages:...Array<MessagePayload["text"]>)
                ChatStore.update((items) => [
                    ...items,
                    { ...message, payload: displayMsg },
                ]);
                break;
            }
            case 'midi': {
                handleIncomingMIDI(message.payload);
                midi = message.payload;
                break;
            }
            case 'connect': {
                // TODO -- looks like this type is equal to teh User
                // defined in `store/user.ts`
                UserStore.set(message.payload);
                break;
            }
            default: {
                console.warn('Unknown message type', message);
                Warning('Unknown message type');
                break;
            }
        }
    }

    onMount(async () => {
        await initJam();

        $JamStore.ws.onopen = () => {
            Success('Connection established.');
        };
        $JamStore.ws.onmessage = (event: MessageEvent) => {
            // TODO -- should we handle errors here? [try/catch]
            console.log(event.data);
            let message = MessageParser.decode(event.data);
            handleWSMsg(message);
        };
        $JamStore.ws.onerror = (event: ErrorEvent) => {
            Failure(event.error);
            $JamStore.ws.close();
        };
        $JamStore.ws.onclose = () => {
            Info('Connection was closed.');
        };
    });


    const toggleChat = createToggle(false)

    const togglePiano = createToggle(false)

    const toggleSettings = createToggle(false);

    onDestroy(() => unsubscribe());
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
            {#if $togglePiano}
                <Piano />
            {/if}
        </div>
        <div class="jam-extras">
            {#if $toggleChat}
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
                    on:click={togglePiano.toggle}><Icon name="music" /></Button>
                <Button
                    type="button"
                    on:click={toggleSettings.toggle}
                    ><Icon name="settings" /></Button>
            </div>
            <div class="chat">
                <Button
                    type="button"
                    on:click={toggleChat.toggle}>
                    <Icon name="message-square" />
                </Button>
            </div>
        </div>
    </div>
    {#if $toggleSettings}
        <Settings on:close={toggleSettings.toggle} />
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
