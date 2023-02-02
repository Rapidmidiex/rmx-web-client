<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { navigate } from 'svelte-navigator';
    import { v4 as uuidv4 } from 'uuid';
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

    export let jamID: string;
    let midi: MIDIMsg;
    let micOn: boolean = false;
    let micInit: boolean = false;

    /*-------------------Audio related code---------------------*/

    let audioContext: AudioContext = null;
    let analyser: AnalyserNode = null;
    let mediaStream: MediaStream = null;
    let mediaStreamSource: MediaStreamAudioSourceNode = null;
    let sensitivity = 0.05;
    const octaveLength = 12;
    let pitch = 0;
    let noteHistory: number[] = [];
    const historyLength = 2;

    const unsubscribe = pingStats.subscribe((value) => {
        console.log(value);
    });

    let noteStrings = [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
    ];
    function autoCorrelate(buf: Float32Array, sampleRate: number) {
        let SIZE = buf.length;
        let rms = 0;
        for (let i = 0; i < SIZE; i++) {
            let val = buf[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);
        if (rms < sensitivity) return -1;
        let r1 = 0,
            r2 = SIZE - 1,
            thres = 0.2;
        for (let i = 0; i < SIZE / 2; i++)
            if (Math.abs(buf[i]) < thres) {
                r1 = i;
                break;
            }
        for (let i = 1; i < SIZE / 2; i++)
            if (Math.abs(buf[SIZE - i]) < thres) {
                r2 = SIZE - i;
                break;
            }
        buf = buf.slice(r1, r2);
        SIZE = buf.length;
        let c = new Array(SIZE).fill(0);
        for (let i = 0; i < SIZE; i++)
            for (let j = 0; j < SIZE - i; j++)
                c[i] = c[i] + buf[j] * buf[j + i];
        let d = 0;
        while (c[d] > c[d + 1]) d++;
        let maxval = -1,
            maxpos = -1;
        for (let i = d; i < SIZE; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        let T0 = maxpos;
        let x1 = c[T0 - 1],
            x2 = c[T0],
            x3 = c[T0 + 1];
        let a = (x1 + x3 - 2 * x2) / 2,
            b = (x3 - x1) / 2;
        if (a) T0 = T0 - b / (2 * a);
        return sampleRate / T0;
    }

    async function getUserMedia() {
        navigator.mediaDevices
            .getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
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
        mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        mediaStreamSource.connect(analyser);
        updatePitch();
    }

    function noteFromPitch(frequency: number) {
        var noteNum = octaveLength * (Math.log(frequency / 440) / Math.log(2));
        return Math.round(noteNum) + 69;
    }

    let bufLen = 2048;
    let buf = new Float32Array(bufLen);

    function updatePitch() {
        analyser.getFloatTimeDomainData(buf);
        let ac = autoCorrelate(buf, audioContext.sampleRate);
        if (ac != -1) {
            pitch = ac;
            let noteNum = noteFromPitch(pitch);
            if (noteNum !== noteHistory[noteHistory.length - 1]) {
                if (noteHistory.length === historyLength) {
                    noteHistory.shift();
                }
                noteHistory = [...noteHistory, noteNum];
                // FIXME: still sends repeated notes.
                // send new note to websocket
                let midi: MIDIMsg = {
                    state: NoteState.NOTE_ON,
                    number: noteNum,
                };

                let msg: WSMsg<MIDIMsg> = {
                    id: uuidv4(),
                    type: WSMsgTyp.MIDI,
                    payload: midi,
                    userId: $UserStore.userId,
                };

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

    /*-------------------Audio related code---------------------*/

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
            JamStore.set({
                ...data,
                players: [],
                ws: new WebSocket(`${WS_BASE_URL}/jam/${jamID}`),
            });
            Success('Jam data loaded');
        } catch (err) {
            Failure(err.message);
            navigate('/', { replace: true });
        }
    }

    function sendWSMsg(msg: WSMsg<ConnectMsg | MIDIMsg | TextMsg>) {
        $JamStore.ws.send(JSON.stringify(msg));
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
                <Piano />
            {/if}
        </div>
        <div class="jam-extras">
            <Chat />
        </div>
    </div>
    <div class="jam-controls-con">
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
