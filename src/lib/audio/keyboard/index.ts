import { writable } from "svelte/store";

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

// numbers represent piano key index to trigger
export const keyMap = new Map([
    ['KeyA', 0],
    ['KeyW', 1],
    ['KeyS', 2],
    ['KeyD', 3],
    ['KeyE', 4],
    ['KeyF', 5],
    ['KeyT', 6],
    ['KeyG', 7],
    ['KeyH', 8],
    ['KeyY', 9],
    ['KeyJ', 10],
    ['KeyU', 11],
    ['KeyK', 12],
    ['KeyO', 13],
    ['KeyL', 14],
    ['Semicolon', 15],
    ['BracketLeft', 16],
    ['Quote', 17],
]);

export const keySpacingMap = new Map<number, number>([
    [0, 0],
    [1, 0.5],
    [2, 1],
    [3, 2],
    [4, 2.5],
    [5, 3],
    [6, 3.5],
    [7, 4],
    [8, 5],
    [9, 5.5],
    [10, 6],
    [11, 6.5],
    [12, 7],
    [13, 7.5],
    [14, 8],
    [15, 9],
    [16, 9.5],
    [17, 10]
])

export const defaultPianoLayout: KeyboardLayout = {
    length: 88,
    firstOctave: [
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
    ]
}

export const KeyboardStore = writable<KeyboardState>({
    layout: defaultPianoLayout,
    keydown: false,
    currNote: null,
    currNotes: defaultPianoLayout.firstOctave,
});

export function generateNotes(layout: KeyboardLayout): KeyNote[] {
    const { length, firstOctave } = layout;
    const notes: KeyNote[] = [];

    for (let i = 0; i < length; i++) {
        // create the note object and add it to the notes array
        const note: KeyNote = {
            midi: firstOctave[0].midi + i,
            note: firstOctave[i % firstOctave.length].note
        }
        notes.push(note);
    }

    return notes;
}

type NoteName =
    | 'A'
    | 'A#'
    | 'B'
    | 'C'
    | 'C#'
    | 'D'
    | 'D#'
    | 'E'
    | 'F'
    | 'F#'
    | 'G'
    | 'G#';
type NoteSound =
    | 'La'
    | 'La#'
    | 'Ti'
    | 'Do'
    | 'Do#'
    | 'Re'
    | 'Re#'
    | 'Mi'
    | 'Fa'
    | 'Fa#'
    | 'So'
    | 'So#';

export interface Note {
    name: [NoteName, NoteSound];
    black: boolean;
}

export interface KeyNote {
    midi: number;
    note: Note;
}

export interface KeyboardLayout {
    length: number;
    firstOctave: KeyNote[];
}

export interface KeyboardState {
    layout: KeyboardLayout;
    keydown?: boolean;
    currNote?: KeyNote;
    currNotes?: KeyNote[];
}

export interface KeyWithBinding {
    note: KeyNote
    binding: string;
}
