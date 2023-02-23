import { v4 as uuid } from "uuid";

type Payload = {
    "text": {
        displayName: string;
        body: string;
    };
    "midi": {
        state: 0 | 1;
        number: number;
        velocity: number;
    };
    "connect": {
        userId: string;
        userName: string;
    };
};

type MessageType = keyof Payload;

export type Message<T extends MessageType = MessageType> = {
    [K in T]: {
        type: K;
        payload: Payload[K];
        id: string;
        userId: string;
    }
}[T];

export class MessageParser {
    constructor(private readonly userId: string) { }

    static decode<T extends MessageType>(s: string): Message<T> {
        return JSON.parse(s);
    }

    decode<T extends MessageType>(s: string): Message<T> {
        return JSON.parse(s);
    }

    // TODO -- I would rather this accepts an object,
    // but this will work for now
    static encode<T extends MessageType>(userId: string, t: T, p: Payload[T]): string {
        return JSON.stringify({
            id: uuid(),
            userId,
            type: t,
            payload: p
        }satisfies Message<T>);
    }

    encode<T extends MessageType>(t: T, p: Payload[T]): string {
        return JSON.stringify({
            id: uuid(),
            userId: this.userId,
            type: t,
            payload: p
        }satisfies Message<T>);
    }
}