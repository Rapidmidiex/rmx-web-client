<script lang="ts">
    // TODO -- I would like to ask why we are importing so much, try and reduce this
    import { onDestroy, onMount } from 'svelte';
    import { agent } from '@lib/api';
    import { notification } from '@lib/notification';
    import Icon from '@components/base/Icon.svelte';
    import Chat from '@components/chat/Chat.svelte';
    import Piano from '@components/instruments/piano/Piano.svelte';
    import DeviceSelect from '@components/DeviceSelect.svelte';
    import SettingsModal from '@components/modals/SettingsModal.svelte';
    import { chatStore } from '@lib/jam/chat';
    import { freqAnalyze, noteFromPitch } from '@lib/audio/mic';
    import { handleIncomingMIDI } from '@lib/audio/midi';
    import Button from '@components/base/Button.svelte';
    import Page from '@components/base/Page.svelte';
    import { createToggle } from '@lib/toggle';
    import { type Payload, MessageParser, type Message } from '@lib/message';
    import { pingStats } from '@lib/ping';
    import { jamStore } from '@lib/jam';
    import { UserStore } from '@lib/user';

    export let jamID: string;

    let midi: Payload<'midi'>;
    let micOn = false;
    let micInit = false;

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

    $: () => handleDeviceSelect(audioDevice);
    async function handleDeviceSelect(device?: MediaDeviceInfo) {
        if (!device) {
            console.warn('No device selected');
            return;
        }
        await getUserMedia(device.deviceId);
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
            $jamStore.ws.send(raw);
        }
        console.log(loudestFreq);
        requestAnimationFrame(updatePitch);
    }

    async function initMic() {
        // TODO -- this can be done at the variable declaration level
        // easier to track
        // FIXME - webkitAudioContext doesn't exist in type `Window` (d.ts file needed)
        audioContext = new (window.AudioContext || window.webkitAudioContext)({
            latencyHint: 'interactive',
        });
        try {
            await getUserMedia();
            micInit = true;
        } catch (err) {
            micInit = false;
            notification.failure(err.message);
            return;
        }
    }

    /*^^^^^^^^^^^^^^^^^^- Audio related code -^^^^^^^^^^^^^^^^^*/

    const unsubscribe = pingStats.subscribe((value) => {
        console.log(value);
    });

    async function toggleMic() {
        if (!micInit) {
            await initMic();
        }

        micOn = !micOn;

        if (mediaStream) {
            mediaStream.getAudioTracks().forEach((track) => {
                track.enabled = micOn;
            });
        }
    }

    function onMessage(message: Message) {
        pingStats.msgIn(message.id);

        switch (message.type) {
            case 'text': {
                let displayMsg = message.payload; //as TextMsg;
                if (message.userId === $UserStore.userId) {
                    displayMsg.displayName = 'You';
                }

                chatStore.saveMessage({ ...message, payload: displayMsg });
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
                notification.warning('Unknown message type');
                break;
            }
        }
    }

    onMount(async () => {
        try {
            // TODO -- this can be handled by the store
            const roomInfo = await agent.jams.get(jamID);
            notification.success('Jam data loaded');

            jamStore.updateRoomInfo(roomInfo);
            jamStore.connectWS(jamID, onMessage);
        } catch (err) {
            notification.failure(err.message);
            agent.redirect.home();
        }
    });

    const toggleChat = createToggle(false);

    const togglePiano = createToggle(false);

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
        <SettingsModal on:close={toggleSettings.toggle} />
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
