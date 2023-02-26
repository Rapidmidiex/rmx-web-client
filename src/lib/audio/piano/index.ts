import { writable } from 'svelte/store';

export const A: Note = { name: ['A', 'La'], black: false };
export const AS: Note = { name: ['A#', 'La#'], black: true };
export const B: Note = { name: ['B', 'Ti'], black: false };
export const C: Note = { name: ['C', 'Do'], black: false };
export const CS: Note = { name: ['C#', 'Do#'], black: true };
export const D: Note = { name: ['D', 'Re'], black: false };
export const DS: Note = { name: ['D#', 'Re#'], black: true };
export const E: Note = { name: ['E', 'Mi'], black: false };
export const F: Note = { name: ['F', 'Fa'], black: false };
export const FS: Note = { name: ['F#', 'Fa#'], black: true };
export const G: Note = { name: ['G', 'So'], black: false };
export const GS: Note = { name: ['G#', 'So#'], black: true };

const octaveNotes: PianoKeyNote[] = [
    { midi: 21, note: A },
    { midi: 22, note: AS },
    { midi: 23, note: B },
    { midi: 24, note: C },
    { midi: 25, note: CS },
    { midi: 26, note: D },
    { midi: 27, note: DS },
    { midi: 28, note: E },
    { midi: 29, note: F },
    { midi: 30, note: FS },
    { midi: 31, note: G },
    { midi: 32, note: GS },
];

const blackMap = 'wetyuop';
const whiteMap = "asdfghjkl;'";

export function genPianoKeys(size: 49 | 61): PianoKeyNote[][] {
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
        // case 76:
        //     startIdx = 7;
        //     break;
        // case 88:
        //     startIdx = 0;
        //     break;
        default:
            startIdx = 3;
    }

    firstNoteMIDI = 21 + startIdx;

    for (let i = 0; i < size; i++) {
        const { note } =
            octaveNotes[
                ((i % octaveNotes.length) + startIdx) % octaveNotes.length
            ];
        const n: PianoKeyNote = { midi: i + firstNoteMIDI, note };
        notes.push(n);
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

export interface Note {
    name: string[];
    black: boolean;
}

export interface PianoKeyNote {
    midi: number;
    note: Note;
}

export interface PianoState {
    keydown?: boolean;
    currNote?: PianoKeyNote;
}

export const PianoStore = writable<PianoState>({
    keydown: false,
    currNote: null,
});
