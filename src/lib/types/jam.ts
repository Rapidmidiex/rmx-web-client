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
