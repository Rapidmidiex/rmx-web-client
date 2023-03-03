import type { TextMessage } from "@lib/message";
import { createStorage } from "../storage";

const createChatStorage = () => {
    const { subscribe, update } = createStorage<Map<string, TextMessage[]>>(
        "CHAT_STORE",
        new Map<string, TextMessage[]>()
    );

    function newChat(jamId: string) {
        update(($storage) => {
            if (!$storage.has(jamId)) return $storage.set(jamId, []);
        });
    }

    function saveMessage(jamId: string, ...message: TextMessage[]) {
        update(($storage) => {
            if ($storage.has(jamId))
                return $storage.set(jamId, [
                    ...$storage.get(jamId),
                    ...message,
                ]);
        });
    }

    return { subscribe, newChat, saveMessage };
};

export const chatStore = createChatStorage();
