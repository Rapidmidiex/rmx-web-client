import * as SoundFont from 'soundfont-player';
import { NoteState, type MIDIMsg } from '@lib/types/jam';
import type { WSMsg } from '@lib/types/websocket';

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

    noteOn(note: number, _velocity: number) {
        this.player.play(note.toString());
    }
}

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
