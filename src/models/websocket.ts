export enum WSMsgTyp {
    TEXT,
    MIDI,
}

export interface WSMsg<T> {
    type: WSMsgTyp;
    payload: T;
}
