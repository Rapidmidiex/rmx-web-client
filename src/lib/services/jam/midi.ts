import * as SoundFont from 'soundfont-player';
import type {   MidiMessage } from "@lib/envelope/message";

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

// TODO -- this may work in a different file
export function handleIncomingMIDI(midi: MidiMessage["payload"]) {
    // TODO -- objects passed by reference so should be able to just pass that
    // via args
    // const midi = message.payload;
    switch (midi.state) {
        case 1: // NOTE_ON
            instrument.noteOn(midi.number, midi.velocity);
            break;
        case 0: // NOTE_OFF
            // synth.noteOff(0, midi.number);
            break;
        default:
            break;
    }
}
