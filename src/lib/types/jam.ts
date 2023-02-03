export interface Jam {
    id: string;
    name: string;
    capacity: number;
    bpm: number;
    players: string[];
    ws: WebSocket;
}

export interface CreateJamData {
    name: string;
    capacity: number;
    bpm: number;
}

export interface GetJamData {
    id: string;
    name: string;
    capacity: number;
    bpm: number;
}

export enum NoteState {
    NOTE_OFF,
    NOTE_ON,
}

export interface MIDIMsg {
    state: NoteState;
    // channel:  number; // not required
    number: number;
    velocity: number;
}

export interface ConnectMsg {
    userId: string;
    userName: string;
}

export interface TextMsg {
    displayName: string;
    body: string;
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
    keydown: boolean;
    currNote: PianoKeyNote;
}
