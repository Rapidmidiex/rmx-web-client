import type { Jam, PianoState, TextMsg } from 'src/lib/types/jam';
import type { WSMsg } from 'src/lib/types/websocket';
import { writable } from 'svelte/store';

const pianoStateDefault: PianoState = {
    keydown: false,
    currNote: null
}

export const JamStore = writable<Jam>();
export const JamTextStore = writable<WSMsg<TextMsg>[]>([]);
export const JamPianoStore = writable<PianoState>(pianoStateDefault);
