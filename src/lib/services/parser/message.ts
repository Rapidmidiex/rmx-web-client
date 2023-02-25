import type { Message, MessageType, Payload } from "@lib/types/message";
import { v4 as uuid } from "uuid";

export class MessageParser {
    constructor(private userId: string) { }

    static decode<T extends MessageType>(raw: string): Message<T> {
        return JSON.parse(raw);
    }
    decode<T extends MessageType>(raw: string): Message<T> {
        return JSON.parse(raw);
    }

    static encode<T extends MessageType>(userId: string, messageType: T, payload: Payload<T>): string {
        return JSON.stringify({
            id: uuid(),
            userId,
            type: messageType,
            payload: payload
        }satisfies Message<T>);
    }
    encode<T extends MessageType>(messageType: T, payload: Payload<T>): string {
        return JSON.stringify({
            id: uuid(),
            userId: this.userId,
            type: messageType,
            payload: payload
        }satisfies Message<T>);
    }
}