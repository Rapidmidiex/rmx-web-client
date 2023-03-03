import type { TextMessage } from '@lib/message';
import { createStorage } from '../storage';

interface ChatHistory {
    [jamId: string]: TextMessage[];
}

const createChatStorage = () => {
    const { subscribe, update } = createStorage<ChatHistory>('CHAT_STORE', {});

    function newChat(jamId: string) {
        update(($storage) => {
            if ($storage[jamId] === undefined) {
                $storage[jamId] = []
            }

            return $storage
        });
    }

    function saveMessage(jamId: string, ...message: TextMessage[]) {
        update(($storage) => {
            if ($storage[jamId])
                return {
                    ...$storage,
                    [jamId]: [...$storage[jamId], ...message],
                };
        });
    }

    return { subscribe, newChat, saveMessage };
};

export const chatStore = createChatStorage();
