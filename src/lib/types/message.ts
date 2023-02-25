export type MessagePayload = {
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

export type Payload<T extends MessageType = MessageType> = MessagePayload[T];

export type MessageType = keyof MessagePayload;

export type Message<T extends MessageType = MessageType> = {
    [K in T]: {
        type: K;
        payload: MessagePayload[K];
        id: string;
        userId: string;
    }
}[T];

export type MidiMessage = Message<"midi">;

export type TextMessage = Message<"text">;

export type ConnectMessage = Message<"connect">;