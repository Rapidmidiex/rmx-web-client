import type { TextMessage } from "@lib/envelope/message";
import { storage } from '@lib/services/store/store';

export const ChatStore = storage<TextMessage[]>('CHAT_STORE', []);
