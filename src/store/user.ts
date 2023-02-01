import type { User } from 'src/lib/types/user';
import { writable } from 'svelte/store';

export const UserStore = writable<User>({
    userId: null,
    userName: null,
});
