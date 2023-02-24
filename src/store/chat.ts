import type {  TextMessage } from "@lib/envelope/message";
import { storage } from '@lib/services/store/store';

// TODO -- omitting `type` as not really needed here
export const ChatStore = storage<TextMessage[]>('CHAT_STORE', []);
