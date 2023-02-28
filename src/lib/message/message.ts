import { v4 as uuid } from 'uuid';

export class MessageParser {
    constructor(private userId: string) {}

    static decode<T extends MessageType>(raw: string): Message<T> {
        return JSON.parse(raw);
    }
    decode<T extends MessageType>(raw: string): Message<T> {
        return JSON.parse(raw);
    }

    static encode<T extends MessageType>(
        userId: string,
        messageType: T,
        payload: Payload<T>
    ): string {
        return JSON.stringify({
            id: uuid(),
            userId,
            type: messageType,
            payload: payload,
        } satisfies Message<T>);
    }
    encode<T extends MessageType>(messageType: T, payload: Payload<T>): string {
        return JSON.stringify({
            id: uuid(),
            userId: this.userId,
            type: messageType,
            payload: payload,
        } satisfies Message<T>);
    }
}

export type MessagePayload = {
    text: {
        displayName: string;
        body: string;
    };
    midi: {
        state: NoteState;
        number: number;
        velocity: number;
    };
    connect: {
        userId: string;
        userName: string;
    };
};

// Text Messages

// Midi Messages

export type NoteState = 0 | 1;

// Connect Messages

export type Payload<T extends MessageType = MessageType> = MessagePayload[T];

export type MessageType = keyof MessagePayload;

export type Message<T extends MessageType = MessageType> = {
    [K in T]: {
        type: K;
        payload: MessagePayload[K];
        id: string;
        userId: string;
    };
}[T];

export type MidiMessage = Message<'midi'>;

export type TextMessage = Message<'text'>;

export type ConnectMessage = Message<'connect'>;
