import type { TextMessage } from "@lib/message";
import { createStorage } from "../lib/storage";

export const ChatStore = createStorage<TextMessage[]>('CHAT_STORE', []);
