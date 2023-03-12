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

export const [smallKeyboard, mediumKeyboard]: KeyboardSize[] = [
    { length: 49, startingNote: { midi: 24, note: C } },
    { length: 61, startingNote: { midi: 24, note: C } },
];

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

export type KeyLabel = 'note' | 'midi';

export interface Note {
    name: [NoteName, NoteSound];
    black: boolean;
}

type KeyboardLength = 49 | 61

export interface KeyboardSize {
    length: KeyboardLength;
    startingNote: PianoKeyNote;
}

export interface PianoKeyNote {
    midi: number;
    note: Note;
}

export interface PianoState {
    size?: KeyboardSize;
    keydown?: boolean;
    currOctave?: number;
    currNote?: PianoKeyNote;
    octaveNotes?: PianoKeyNote[];
}

export const PianoStore = writable<PianoState>({
    size: smallKeyboard,
    keydown: false,
    currOctave: 1,
    currNote: null,
    octaveNotes: [
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
    ],
});
