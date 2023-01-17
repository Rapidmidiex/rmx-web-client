export interface Jam {
    id: string;
    name: string;
    bpm: number;
    users: string[];
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
    bpm: number;
}

export enum NoteState {
    NOTE_OFF,
    NOTE_ON
}

export interface MIDIMsg {
    State:    NoteState;
    // Channel:  number; // not required
    Number:   number;
    // Velocity: number; // not required
}