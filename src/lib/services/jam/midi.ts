import * as SoundFont from 'soundfont-player';
import { Envelope } from '@lib/envelope/envelope';
import { NoteState, type MIDIMsg } from '@lib/types/jam';
import { WSMsgTyp, type WSMsg } from '@lib/types/websocket';

class Instrument {
    private ac: AudioContext;
    private player: SoundFont.Player;
    constructor() {
        this.ac = new AudioContext();
        SoundFont.instrument(this.ac, 'acoustic_grand_piano')
            .then((i) => {
                this.player = i;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    noteOn(note: number, velocity: number) {
        this.player.play(note);
    }
}

// /**
//  *
//  * @param wsClient WebSocket Client
//  * @param userId User ID
//  * @returns an instrument note event handler that sends MIDI messages over the WebSocket connection
//  */
// export function noteHandler(wsClient: WebSocket, userId: string) {
//     return (e: CustomEvent<MIDIMsg>) => {
//         const { detail: msg } = e;
//         const wsMsg = new Envelope(userId, WSMsgTyp.MIDI, msg);
//         wsClient.send(wsMsg.json());
//     };
// }

const instrument = new Instrument();

export function handleIncomingMIDI(msg: WSMsg<MIDIMsg>) {
    // TODO play different users on different channels
    // TODO: use instrument from MIDI message
    const midi = msg.payload;
    switch (midi.state) {
        case NoteState.NOTE_ON:
            instrument.noteOn(midi.number, midi.velocity);
            break;
        case NoteState.NOTE_OFF:
            // synth.noteOff(0, midi.number);
            break;

        default:
            break;
    }
}
