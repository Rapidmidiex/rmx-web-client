import type { TextMessage } from '@lib/message';
import { writable } from 'svelte/store';

const createChatStorage = () => {
    const { subscribe, update } = writable<TextMessage[]>([]);

    function saveMessage(...message: TextMessage[]) {
        update(($storage) => {
            return [...$storage, ...message];
        });
    }

    return { subscribe, saveMessage };
};

export const chatStore = createChatStorage();
