export interface Jam {
    id: string;
    name: string;
    capacity: number;
    bpm: number;
    players: string[];
    ws: WebSocket;
    audioInputDevice: MediaDeviceInfo | null;
    availableDevices: MediaDeviceInfo[];
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

// TODO -- these message types I would like to remove as the new `message.ts` file is more robust
export interface MIDIMsg {
    state: NoteState;
    // channel:  number; // not required
    number: number;
    velocity: number;
}

// TODO -- these message types I would like to remove as the new `message.ts` file is more robust
export interface ConnectMsg {
    userId: string;
    userName: string;
}

// TODO -- these message types I would like to remove as the new `message.ts` file is more robust
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
    keydown?: boolean;
    currNote?: PianoKeyNote;
}
