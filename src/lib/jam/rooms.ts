// TODO -- I need to rename this as there is already a jam store file
// I can merge them but either case, I need to rename these variable names
import { agent, type JamRoom } from '@lib/api';
import { notification } from "@lib/notification";
import fuzzysort from 'fuzzysort';
import { derived, get, writable } from 'svelte/store';

export const jamRoomStore = writable<JamRoom[]>([]);

export const fetchState = writable<'loading' | 'done'>('loading');

export const errorState = writable<Error | null>(null);

export async function getJamRooms() {
    try {
        const rooms = await agent.jams.list();
        jamRoomStore.set(rooms);
        fetchState.set('done');
        errorState.set(null);
        return rooms;
    } catch (error) {
        errorState.set(error);
        notification.failure(error.message)
    }
}

const filteredJams = (query: string) =>
    derived([jamRoomStore], ([$jamRoomStore]) => {
        if (query === '') return $jamRoomStore;
        return fuzzysort
            .go(query, $jamRoomStore, {
                all: false,
                key: 'name',
            })
            .map((res) => res.obj);
    });

export function getFilteredJams(query: string) {
    return get(filteredJams(query));
}
