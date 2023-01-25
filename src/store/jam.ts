import type { WSMsg } from '../models/websocket';
import { writable } from 'svelte/store';
import type { Jam, TextMsg } from '../models/jam';

export const JamStore = writable<Jam>();
export const JamTextStore = writable<WSMsg<TextMsg>[]>([]);
