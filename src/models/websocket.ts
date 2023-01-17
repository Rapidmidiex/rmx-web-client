export enum WSMsgTyp {
    TEXT,
    JSON,
    MIDI
}

export interface WSMsg {
    type: WSMsgTyp;
    msg: any;
} 