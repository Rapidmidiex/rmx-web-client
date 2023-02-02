import type { PianoKeyNote } from '../types/jam';

const octaveNotes: PianoKeyNote[] = [
    { midi: 21, name: ['A', 'La'], black: false },
    { midi: 22, name: ['A#', 'La#'], black: true },
    { midi: 23, name: ['B', 'Ti'], black: false },
    { midi: 24, name: ['C', 'Do'], black: false },
    { midi: 25, name: ['C#', 'Do#'], black: true },
    { midi: 26, name: ['D', 'Re'], black: false },
    { midi: 27, name: ['D#', 'Re#'], black: true },
    { midi: 28, name: ['E', 'Mi'], black: false },
    { midi: 29, name: ['F', 'Fa'], black: false },
    { midi: 30, name: ['F#', 'Fa#'], black: true },
    { midi: 31, name: ['G', 'So'], black: false },
    { midi: 32, name: ['G#', 'So#'], black: true },
];

export function genPianoKeys(size: 49 | 61 | 76 | 88): PianoKeyNote[][] {
    let notes: PianoKeyNote[] = [];
    let startIdx: number;
    let firstNoteMIDI: number;

    switch (size) {
        case 49:
            startIdx = 3;
            break;
        case 61:
            startIdx = 3;
            break;
        case 76:
            startIdx = 7;
            break;
        case 88:
            startIdx = 0;
            break;
        default:
            startIdx = 3;
    }

    firstNoteMIDI = 21 + startIdx;

    for (let i = 0; i < size; i++) {
        const { name, black } =
            octaveNotes[
                ((i % octaveNotes.length) + startIdx) % octaveNotes.length
            ];
        const note: PianoKeyNote = { midi: i + firstNoteMIDI, name, black };
        notes.push(note);
    }

    return chunkBy(notes, octaveNotes.length);
}

function chunkBy<T>(arr: T[], chunkSize: number): T[][] {
    let result: T[][] = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        result.push(chunk);
    }

    return result;
}
