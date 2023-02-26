import type { TextMessage } from '@lib/message';
import { createStorage } from '../storage';

export const ChatStore = createStorage<TextMessage[]>('CHAT_STORE', []);
