import type { User } from 'src/models/user';
import { writable } from 'svelte/store';

export const UserStore = writable<User>({
    userId: null,
});
