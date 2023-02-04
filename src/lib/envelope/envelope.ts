import { v4 as uuidv4 } from 'uuid';
import type { MIDIMsg, TextMsg } from '@lib/types/jam';
import type { WSMsg, WSMsgTyp } from '@lib/types/websocket';

export class Envelope<T extends MIDIMsg | TextMsg> {
    /**
     * Parses a WSMsg from a JSON WebSocket message.
     * @example
     * Envelope.fromJSON(event.data)
     * @param json WebSocket message
     * @returns Envelope instance
     */
    static fromJSON<T extends MIDIMsg | TextMsg>(json: string): Envelope<T> {
        const parsed = JSON.parse(json) as Envelope<T>;
        return new Envelope(parsed.userId, parsed.type, parsed.payload);
    }

    private type: WSMsgTyp;
    private payload: T;
    private id: string;
    private userId: string;

    constructor(userId: string, type: WSMsgTyp, payload: T) {
        this.type = type;
        this.payload = payload;
        this.id = uuidv4();
        this.userId = userId;
    }

    /**
     *
     * @returns JSON serialized WebSocket message
     */
    json() {
        const { id, payload, type, userId } = this;
        const message: WSMsg<T> = {
            id,
            payload,
            type,
            userId,
        };
        return JSON.stringify(message);
    }
}
