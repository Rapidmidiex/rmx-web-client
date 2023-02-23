// TODO -- can delete this in favour of the new `message.ts` file
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
