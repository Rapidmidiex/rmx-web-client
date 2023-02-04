import { Envelope } from '@lib/envelope/envelope';
import type { MIDIMsg } from '@lib/types/jam';
import { WSMsgTyp, type WSMsg } from '@lib/types/websocket';

// @ts-ignore
// TODO: synth @types
const synth = JZZ.synth.Tiny();

/**
 *
 * @param wsClient WebSocket Client
 * @param userId User ID
 * @returns an instrument note event handler that sends MIDI messages over the WebSocket connection
 */
export function noteHandler(wsClient: WebSocket, userId: string) {
    return (e: CustomEvent<MIDIMsg>) => {
        const { detail: msg } = e;
        const wsMsg = new Envelope(userId, WSMsgTyp.MIDI, msg);
        wsClient.send(wsMsg.json());
    };
}

export function handleIncomingMIDI(msg: WSMsg<MIDIMsg>) {
    // TODO play different users on different channels
    // TODO: use instrument from MIDI message
    synth.noteOn(0, msg.payload.number, 127);
}
