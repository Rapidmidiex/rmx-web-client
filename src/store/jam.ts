import { writable } from "svelte/store";
import type {MIDIMsg, Jam} from "../models/jam"

export const JamStore = writable<Jam>();
export const JamMIDIStore = writable<MIDIMsg[]>([]);
export const JamTextStore = writable<string[]>([]);