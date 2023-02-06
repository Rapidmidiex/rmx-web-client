import * as JZZ from 'jzz';
import { Envelope } from '@lib/envelope/envelope';
import { NoteState, type MIDIMsg } from '@lib/types/jam';
import { WSMsgTyp, type WSMsg } from '@lib/types/websocket';

import * as JZZSynthTiny from 'jzz-synth-tiny';
JZZSynthTiny(JZZ);
// @ts-ignore
const synth = JZZ.synth.Tiny() as typeof JZZ.MIDI;
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
    const midi = msg.payload;
    switch (midi.state) {
        case NoteState.NOTE_ON:
            synth.noteOn(0, midi.number, midi.velocity);
            break;
        case NoteState.NOTE_OFF:
            synth.noteOff(0, midi.number);
            break;

        default:
            break;
    }
}
