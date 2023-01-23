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
    // velocity: number; // not required
}

export interface ConnectMsg {
    userId: string;
    username: string;
}

export interface TextMsg {
    body: string;
}
