/**
 *
 * @param buf Array of audio sample values, represented as floats ranging from -1 to 1.
 * @param sampleRate Number of samples per second. Ex: (44100, 48000).
 * @param threshold Minimum loudness level needed to attempt auto note correlation. Sounds with RMS levels below the threshold are discarded.
 * @returns a float representing the estimated frequency (hz) of average loudest sound contained in the buffer.
 */
export function autoCorrelate(
    buf: Float32Array,
    sampleRate: number,
    threshold: number
) {
    let SIZE = buf.length;
    const rms = calcRMS(buf);

    // Stop if RMS below threshold
    if (rms < threshold) return -1;

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
 * @returns MIDI note number
 */
export function noteFromPitch(frequency: number, octaveLength: number = 12) {
    const A4 = { freq: 440, midi: 69 };
    var noteNum = octaveLength * (Math.log(frequency / A4.freq) / Math.log(2));
    return Math.round(noteNum) + A4.midi;
}

/**
 * Calculates the average decibel level across all frequencies.
 * @param analyser AnalyserNode
 * @returns An integer representing decibel level.
 */
export function meter(analyser: AnalyserNode) {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    const arraySum = array.reduce((a, value) => a + value, 0);
    const average = arraySum / array.length;
    console.log(Math.round(average));
}
