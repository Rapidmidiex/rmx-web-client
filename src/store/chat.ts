import type { TextMsg } from "@lib/types/jam";
import type { WSMsg } from "@lib/types/websocket";
import { writable } from "svelte/store";

export const ChatStore = writable<WSMsg<TextMsg>[]>([]);
