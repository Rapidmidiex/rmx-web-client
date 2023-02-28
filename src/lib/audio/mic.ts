/**
 *
 * @param buf Array of audio sample values, represented as floats ranging from -1 to 1.
 * @param sampleRate Number of samples per second. Ex: (44100, 48000).
 * @returns a float representing the estimated frequency (hz) of average loudest sound contained in the buffer.
 */
export function autoCorrelate(buf: Float32Array, sampleRate: number) {
    let SIZE = buf.length;

    // Trim buffer to the section containing levels above the thres.
    let leftBoundary = 0;
    let rightBoundary = SIZE - 1;
    let thres = 0.2;
    // Trim left
    for (let i = 0; i < SIZE / 2; i++)
        if (Math.abs(buf[i]) < thres) {
            leftBoundary = i;
            break;
        }
    // Trim right
    for (let i = 1; i < SIZE / 2; i++)
        if (Math.abs(buf[SIZE - i]) < thres) {
            rightBoundary = SIZE - i;
            break;
        }
    buf = buf.slice(leftBoundary, rightBoundary);
    SIZE = buf.length;
    // End Trim

    // Create a new buffer with the trimmed size.
    let cBuf = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE - i; j++) {
            // TODO: Document this
            cBuf[i] = cBuf[i] + buf[j] * buf[j + i];
        }
    }

    let d = 0;
    while (cBuf[d] > cBuf[d + 1]) d++;
    let maxVal = -1;
    let maxPos = -1;
    for (let i = d; i < SIZE; i++) {
        if (cBuf[i] > maxVal) {
            maxVal = cBuf[i];
            maxPos = i;
        }
    }
    let T0 = maxPos;
    let x1 = cBuf[T0 - 1];
    let x2 = cBuf[T0];
    let x3 = cBuf[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);
    return sampleRate / T0;
}

/**
 * Calculates the root-mean-squared (RMS) of audio samples. The RMS is the average squared value of all the samples in a buffer.
 */
function calcRMS(buf: Float32Array): number {
    let rms = 0;
    const size = buf.length;
    for (let i = 0; i < size; i++) {
        let val = buf[i];
        rms += val * val;
    }
    return Math.sqrt(rms / size);
}

/**
 * Converts audio frequency (hz) to MIDI note number.
 * @example
 * noteFromPitch(261.6) === 60 // Middle C
 * @param frequency hertz
 * @param octaveLength Number of notes in an octave. Defaults to 12.
 */
export function noteFromPitch(
    frequency: number,
    octaveLength: number = 12
): number | null {
    const A4 = { freq: 440, midi: 69 };
    var noteNum = octaveLength * (Math.log(frequency / A4.freq) / Math.log(2));
    const midiNote = Math.round(noteNum) + A4.midi;
    if (midiNote < 0 || midiNote > 127) {
        return null;
    }
    return midiNote;
}

/**
 * Calculates the average decibel level across all frequencies.
 * @param analyser AnalyserNode
 * @returns An integer representing decibel level.
 */
export function meter(analyser: AnalyserNode) {
    const freqLevels = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqLevels);
    const sum = freqLevels.reduce((sum, value) => sum + value, 0);
    const average = sum / freqLevels.length;
    return Math.round(average);
}

/**
 * Produces a summary of frequency-based statistics used to determine when and what MIDI note to play.
 * @param analyser
 * @param threshold Integer (0-255) representing the minimum level of the audio input to return true.
 */
export function freqAnalyze(
    analyser: AnalyserNode,
    threshold: number,
    debug: boolean = false
) {
    const buf = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(buf);
    let max = 0;
    let maxIndex = -1;
    let min = Infinity;
    const sum = buf.reduce((sum, value, i) => {
        if (value > max) {
            max = value;
            maxIndex = i;
        }
        min = Math.min(min, value);
        return sum + value;
    }, 0);
    const average = sum / buf.length;
    const maxFreq = analyser.context.sampleRate / 2;
    let loudestFreq = 0;
    if (maxIndex > -1) {
        // Frequencies are linearly spaced in buffer from 0 - maxFreq (22khz for 44.1khz sample rate)
        // The loudest frequency is at maxIndex
        loudestFreq = (maxIndex / buf.length) * maxFreq;
    }
    const stats = {
        avg: Math.round(average),
        max,
        min,
        length: buf.length,
        loudestFreq,
        thresholdMet: max >= threshold,
    };
    if (debug) {
        console.log(stats);
    }
    return stats;
}
