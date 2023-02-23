import type { Message, MessagePayload } from "@lib/envelope/message";
import { storage } from '@lib/services/store/store';
import { get, writable } from "svelte/store";

// TODO -- omitting `type` as not really needed here
export const ChatStore = storage<Omit<Message<"text">, "type">[]>('CHAT_STORE', []);


type Chat = MessagePayload["text"]

const ChatStorage = (storageName = "", initValue = []) =>{
    const store = writable(initValue);

    const storedValueStr = localStorage.getItem(storageName);
    if (storedValueStr != null) store.set(JSON.parse(storedValueStr));

    store.subscribe((val) => {
        if ([null, undefined].includes(val)) {
            localStorage.removeItem(storageName);
        } else {
            localStorage.setItem(storageName, JSON.stringify(val));
        }
    });

    window.addEventListener('storage', () => {
        const storedValueStr = localStorage.getItem(storageName);
        if (storedValueStr == null) return;

        const localValue = JSON.parse(storedValueStr);
        if (localValue !== get(store)) store.set(localValue);
    });

    return {
        update:(...chats: Chat[])=>{
            store.update((acc)=> [...acc, ...chats]);
        },
        // length of svelte store
    l: () => get(store).length,  
    } as const;
}