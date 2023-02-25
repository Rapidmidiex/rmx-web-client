import type { TextMessage } from "@lib/types/message";
import { storage } from '@lib/services/store/store';

export const ChatStore = storage<TextMessage[]>('CHAT_STORE', []);
