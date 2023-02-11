import type { PianoState } from '@lib/types/jam';
import { writable } from 'svelte/store';

const pianoStateDefault: PianoState = {
    keydown: false,
    currNote: null,
};

export const PianoStore = writable<PianoState>(pianoStateDefault);
