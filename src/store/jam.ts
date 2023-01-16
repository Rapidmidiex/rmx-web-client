import { writable } from "svelte/store";
import type {Jam} from "../models/jam"

export const JamStore = writable<Jam>();