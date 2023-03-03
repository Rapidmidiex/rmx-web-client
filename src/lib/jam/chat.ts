import type { TextMessage } from "@lib/message";
import { createStorage } from "../storage";

const createChatStorage = (init: TextMessage[] = []) => {
    const { subscribe, update } = createStorage<TextMessage[]>(
        "CHAT_STORE",
        init
    );

    function saveMessage(...message: TextMessage[]) {
        update(($storage) => {
            return [...$storage, ...message];
        });
    }

    return { subscribe, saveMessage };
};

export const chatStore = createChatStorage();
