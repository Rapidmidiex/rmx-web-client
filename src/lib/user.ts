import { writable } from 'svelte/store';

export const UserStore = writable<User>({
    userId: null,
    userName: null,
});

export const createUserStore = () => {
    const { subscribe, update } = writable<User>({
        userId: null,
        userName: null,
    });

    return {
        subscribe,
        update,
    };
};

export const userStore = createUserStore();

export interface User {
    userId: string | null;
    userName: string | null;
}
