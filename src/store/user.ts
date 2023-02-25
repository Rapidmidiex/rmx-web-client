/*
If we are going to pass around a user, we should have more fields
on it.

I introduced the context because even though there is the concept
of global state, having context is still useful.
*/
import type { Payload } from "@lib/types/message";
import { getContext, setContext } from "svelte";
import { writable } from 'svelte/store';

// TODO -- introduce an argument
export const createUser = () => {
    const { subscribe, set } = writable<Payload<"connect">>({
        userId: null,
        userName: null,
    });
    return { subscribe, set };
};

type UserStore = ReturnType<typeof createUser>;

export const userKey = Symbol();

export const setUserStoreContext = (store: UserStore) => {
    setContext(userKey, store);
};

export const getUserStoreContext = () => {
    return getContext<UserStore>(userKey);
};

