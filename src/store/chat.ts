import { storage } from '@lib/services/store/store';
import type { TextMsg } from '@lib/types/jam';
import type { WSMsg } from '@lib/types/websocket';

// TODO -- omitting `type` as not really needed here
export const ChatStore = storage<Omit<WSMsg<TextMsg>, "type">[]>('CHAT_STORE', []);
