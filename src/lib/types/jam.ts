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

type NoteName =
	| "A"
	| "A#"
	| "B"
	| "C"
	| "C#"
	| "D"
	| "D#"
	| "E"
	| "F"
	| "F#"
	| "G"
	| "G#";
type NoteSound =
	| "La"
	| "La#"
	| "Ti"
	| "Do"
	| "Do#"
	| "Re"
	| "Re#"
	| "Mi"
	| "Fa"
	| "Fa#"
	| "So"
	| "So#";

export interface Note {
	name: [NoteName, NoteSound];
	black: boolean;
}

export interface PianoKeyNote {
	midi: number;
	note: Note;
	binding?: KeyBinding;
}

export interface PianoState {
	keydown?: boolean;
	currNote?: PianoKeyNote;
}

export type KeyBinding = {
	keyName: string;
	isAccidental: boolean;
};

export type KeyLabel = "note" | "midi" | "binding";
