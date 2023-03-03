import type { Payload } from '@lib/message';
import * as SoundFont from 'soundfont-player';

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

    // FIXME - _velocity defined but never used
<<<<<<< HEAD
    noteOn(note: number, _velocity: number) {
=======
    noteOn(note: number) {
>>>>>>> main
        this.player.play(note.toString());
    }
}

const instrument = new Instrument();

export function handleIncomingMIDI(midi: Payload<'midi'>) {
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
