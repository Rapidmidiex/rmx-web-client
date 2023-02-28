import { agent, type JamRoom } from '@lib/api';
import { notification } from '@lib/notification';
import { AxiosError } from 'axios';
import fuzzysort from 'fuzzysort';
import { derived, get, writable } from 'svelte/store';

export const jamRoomStore = writable<JamRoom[]>([]);

export const fetchState = writable<'loading' | 'done'>('loading');

export const errorState = writable<Error | null>(null);

export async function getJamRooms() {
    try {
        const rooms = await agent.jams.list();
        jamRoomStore.set(rooms);
        errorState.set(null);
        return rooms;
    } catch (error) {
        errorState.set(error as Error);
        notification.failure((error as AxiosError).message);
    } finally {
        fetchState.set('done');
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
