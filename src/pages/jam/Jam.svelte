<script lang="ts">
    import { WS_BASE_URL } from '../../api/api';
    import { onMount } from 'svelte';
    import { NoteState, type Jam, type MIDIMsg } from '../../models/jam';
    import { JamMIDIStore, JamStore, JamTextStore } from '../../store/jam';
    import { Failure, Info, Success, Warning } from '../../lib/notify/notify';
    import Icon from '../../lib/components/Icon.svelte';
    import { navigate } from 'svelte-navigator';
    import { WSMsgTyp, type WSMsg } from '../../models/websocket';
    import Chat from './components/Chat.svelte';

    let jam: Jam;
    let midiMsgs: MIDIMsg[];
    let textMsgs: string[];
    let micOn: boolean = false;
    let micInit: boolean = false;
    let midiDiv: HTMLDivElement;

    /*-------------------Audio related code---------------------*/

    let audioContext: AudioContext = null;
    let analyser: AnalyserNode = null;
    let mediaStream: MediaStream = null;
    let mediaStreamSource: MediaStreamAudioSourceNode = null;
    let sensitivity = 0.05;
    const octaveLength = 12;
    let pitch = 0;
    let deviation = 0;
    let noteHistory: number[] = [];
    const historyLength = 10;
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
    function autoCorrelate(buf, sampleRate) {
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

    function noteFromPitch(frequency) {
        var noteNum = octaveLength * (Math.log(frequency / 440) / Math.log(2));
        return Math.round(noteNum) + 69;
    }

    function frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2, (note - 69) / octaveLength);
    }

    function centsOffFromPitch(frequency, note) {
        return Math.floor(
            (octaveLength *
                100 *
                Math.log(frequency / frequencyFromNoteNumber(note))) /
                Math.log(2)
        );
    }

    let buflen = 2048;
    let buf = new Float32Array(buflen);

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
                    State: NoteState.NOTE_ON,
                    Number: noteNum,
                };

                let msg: WSMsg = {
                    type: WSMsgTyp.MIDI,
                    msg: midi,
                };

                sendWSMsg(msg);
            }
            deviation = centsOffFromPitch(pitch, noteNum);
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

    function connecWS() {
        if (jam) {
            JamStore.set({
                ...jam,
                ws: new WebSocket(`${WS_BASE_URL}/jam/${jam.id}`),
            });
            return;
        }

        Failure('Jam not found');
        if (jam && jam.ws) {
            jam.ws.close();
        }

        navigate('/', { replace: true });
    }

    function sendWSMsg(msg: WSMsg) {
        jam.ws.send(JSON.stringify(msg));
    }

    function handleWSMsg(msg: WSMsg) {
        switch (msg.type) {
            case WSMsgTyp.TEXT:
                JamTextStore.set([...textMsgs, msg.msg]);
                break;
            case WSMsgTyp.JSON:
                console.log(msg.msg);
                break;
            case WSMsgTyp.MIDI:
                midiDiv.scrollTop = midiDiv.scrollHeight
                JamMIDIStore.set([...midiMsgs, msg.msg]);
                break;
            default:
                Warning('Unknown message type');
        }
    }

    onMount(() => {
        JamStore.subscribe((v) => {
            jam = v;
        });
        JamMIDIStore.subscribe((v) => {
            midiMsgs = v;
        });
        JamTextStore.subscribe((v) => {
            textMsgs = v;
        });
        connecWS();
        jam.ws.onopen = (event: Event) => {
            Success('Connection established.');
        };
        jam.ws.onmessage = (event: MessageEvent) => {
            let msg: WSMsg = JSON.parse(event.data);
            handleWSMsg(msg);
        };
        jam.ws.onerror = (event: ErrorEvent) => {
            Failure(event.error);
            jam.ws.close();
        };
        jam.ws.onclose = (event: CloseEvent) => {
            Info('Connection was closed.');
        };
    });
</script>

<div class="jam page">
    <div class="jam-content">
        <div class="jam-player">
            <div bind:this={midiDiv} class="messages">
                {#if midiMsgs}
                    {#each midiMsgs as msg}
                        <p>{msg.Number}</p>
                    {/each}
                {:else}
                    <p>No message available</p>
                {/if}
            </div>
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
            overflow: auto;

            & > div {
                width: 100%;
                height: 100%;
            }

            .jam-extras {
                width: 30rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem;
            }

            .jam-player {
                display: flex;
                flex-direction: column;

                & > div {
                    width: 100%;
                    height: 100%;
                }

                .messages {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    overflow: auto;

                    & > p {
                        background-color: #000;
                        padding: 1rem 3rem;
                        color: #fff;
                        font-size: 2rem;
                        border-radius: 0.5rem;
                        margin: 0.5rem;
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
                    }
                }
            }
        }
    }
</style>
