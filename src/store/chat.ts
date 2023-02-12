import { CHAT_STORE } from "@lib/consts/store";
import storage from "@lib/services/store/store";
import type { TextMsg } from "@lib/types/jam";
import type { WSMsg } from "@lib/types/websocket";

export const ChatStore = storage<WSMsg<TextMsg>[]>(CHAT_STORE, []);
