import { writable } from 'svelte/store';

export const UserStore = writable<User>({
    userId: null,
    userName: null,
});

export interface User {
    userId: string | null;
    userName: string | null;
}
