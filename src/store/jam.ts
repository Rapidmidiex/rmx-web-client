import type { WSMsg } from '../models/websocket';
import { writable } from 'svelte/store';
import type { PianoState, Jam, TextMsg } from '../models/jam';

const pianoStateDefault: PianoState = {
    keydown: false,
    currNote: null
}

export const JamStore = writable<Jam>();
export const JamTextStore = writable<WSMsg<TextMsg>[]>([]);
export const JamPianoStore = writable<PianoState>(pianoStateDefault);
