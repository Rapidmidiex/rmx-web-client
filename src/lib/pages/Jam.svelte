<script lang="ts">
    import { WS_BASE_URL } from '../../api/api';
    import { onMount } from 'svelte';
    import type { Jam } from '../../models/jam';
    import { JamStore } from '../../store/jam';
    import { Failure, Info, Success } from '../notify/notify';
    import Icon from '../components/Icon.svelte';
    import { navigate } from 'svelte-navigator';

    let ws: WebSocket;
    let jam: Jam;
    let messageEvents: MessageEvent[] = [];
    let micOn: boolean = false;
    let micInit: boolean = false;

    /*-------------------Audio related code---------------------*/

    let audioContext: AudioContext = null;
    let analyser: AnalyserNode = null;
    let mediaStream: MediaStream = null;
    let mediaStreamSource: MediaStreamAudioSourceNode = null;
    let isConfident = false;
    let sensitivity = 0.05;
    const octaveLength = 12;
    let pitch = 0;
    interface Note {
        Name: string;
        Octave: number;
    }
    let note: Note = {
        Name: 'A',
        Octave: 4,
    };
    let octave: number = 4;
    let deviation = 0;
    let noteHistory: Note[] = [];
    const historyLength = 10;
    let startButtonDisabled = false;
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
                startButtonDisabled = true;
            })
            .catch((err) => {
                alert('getUserMedia threw exception:' + err);
                startButtonDisabled = false;
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
        if (ac == -1) {
            isConfident = false;
        } else {
            isConfident = true;
            pitch = ac;
            let noteIdx = noteFromPitch(pitch);
            if (note?.Name !== noteHistory[noteHistory.length - 1]?.Name) {
                if (noteHistory.length === historyLength) {
                    noteHistory.shift();
                }
                noteHistory = [
                    ...noteHistory,
                    { Name: note?.Name, Octave: note.Octave },
                ];
                // FIXME: still sends repeated notes.
                // send new note to websocket
                ws.send(note.Name);
            }
            note.Name = noteStrings[noteIdx % noteStrings.length];
            note.Octave = Math.floor(noteIdx / octaveLength) - 1;
            octave = note.Octave;
            deviation = centsOffFromPitch(pitch, noteIdx);
        }
        requestAnimationFrame(updatePitch);
    }

    function initMic() {
        audioContext = new (window.AudioContext ||
            globalThis.webkitAudioContext)();
        getUserMedia();
    }

    /*-------------------Audio related code---------------------*/

    function toggleMic() {
        if (!micInit) {
            initMic();
            micInit = true;
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
            ws = new WebSocket(`${WS_BASE_URL}/jam/${jam.id}`);
            return
        }

        Failure("Jam not found")
        if(ws) {
            ws.close()
        }
        navigate("/", {replace: true})
    }

    onMount(() => {
        JamStore.subscribe((v) => {
            jam = v;
        });
        connecWS();
        ws.onopen = (event: Event) => {
            Success('Connection established.');
        };
        ws.onmessage = (event: MessageEvent) => {
            messageEvents = [...messageEvents, event];
        };
        ws.onerror = (event: ErrorEvent) => {
            Failure(event.error);
            ws.close();
        };
        ws.onclose = (event: CloseEvent) => {
            Info('Connection was closed.');
        };
    });
</script>

<div class="jam page">
    <div class="jam-content">
        <div class="input">
            <div class="notes">
                {#each noteStrings as note}
                    <button
                        class="btn"
                        type="button"
                        on:click={() => ws.send(note)}>{note}</button>
                {/each}
            </div>
            <div class="audio">
                <button
                    class="btn"
                    type="button"
                    on:click={toggleMic}
                    ><Icon name={micOn ? 'mic' : 'mic-off'} /></button>
                <input
                id="mic-sensitivity"
                    type="range"
                    bind:value={sensitivity}
                    min="0.01"
                    max="0.2"
                    step="0.01" />
                    <label for="mic-sensitivity">the higher the value, the lower the sensitivity</label>
            </div>
        </div>
        <div class="messages">
            {#each messageEvents as msg}
                <p>{msg.data}</p>
            {/each}
        </div>
    </div>
    <div class="jam-info">
        <h3>Jam info</h3>
    </div>
</div>

<style lang="scss">
    .jam {
        display: flex;
        align-items: center;

        & > div {
            height: 100%;
        }

        .jam-info {
            width: 25rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: aquamarine;
        }

        .jam-content {
            width: 100%;
            display: flex;
            flex-direction: column;

            & > div {
                width: 100%;
                height: 100%;
            }

            .input {
                display: flex;

                & > div {
                    width: 100%;
                    height: 100%;
                }

                .notes {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;

                    & > button {
                        padding: 2rem;
                        margin: 0.5rem;
                        font-size: 2rem;
                    }
                }

                .audio {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;

                    & > button {
                        padding: 4rem;
                        border-radius: 100%;
                        font-size: 2rem;
                    }
                }
            }

            .messages {
                display: flex;
                flex-direction: column-reverse;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                overflow: auto;

                & > p {
                    background-color: #000;
                    padding: 1rem 3rem;
                    color: #fff;
                    font-size: 2rem;
                    border-radius: 0.3rem;
                    margin: 0.5rem;
                }
            }
        }
    }
</style>
