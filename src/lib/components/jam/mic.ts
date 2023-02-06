export function autoCorrelate(
    buf: Float32Array,
    sampleRate: number,
    sensitivity: number
) {
    let SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
        const val = buf[i];
        rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    console.log(Math.round(rms * 100));
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
    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
        for (let j = 0; j < SIZE - i; j++) c[i] = c[i] + buf[j] * buf[j + i];
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
    const x1 = c[T0 - 1],
        x2 = c[T0],
        x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2,
        b = (x3 - x1) / 2;
    if (a) {
        T0 = T0 - b / (2 * a);
    }
    return sampleRate / T0;
}

export function noteFromPitch(frequency: number, octaveLength: number) {
    var noteNum = octaveLength * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
}

export function meter(analyser: AnalyserNode) {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    const arraySum = array.reduce((a, value) => a + value, 0);
    const average = arraySum / array.length;
    console.log(Math.round(average));
}
