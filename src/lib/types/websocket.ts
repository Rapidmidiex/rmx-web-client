export enum WSMsgTyp {
    TEXT,
    MIDI,
    CONNECT,
}

export interface WSMsg<T> {
    id: string;
    type: WSMsgTyp;
    userId: string;
    payload: T;
}
