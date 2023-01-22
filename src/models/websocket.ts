export enum WSMsgTyp {
    TEXT,
    MIDI,
    CONNECT,
}

export interface WSMsg<T> {
    type: WSMsgTyp;
    userId: string;
    payload: T;
}
