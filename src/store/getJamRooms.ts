// TODO -- I need to rename this as there is already a jam store file
// I can merge them but either case, I need to rename these variable names
import { agent } from "src/api";
import type { GetJamData } from "@lib/types/jam";
import fuzzysort from "fuzzysort";
import { derived, get, writable } from "svelte/store";

export const jamRoomStore = writable<GetJamData[]>([]);

export const fetchState = writable<"loading" | "done">("loading");

export async function getJamRooms() {
    const { data: { rooms } } = await agent.jams.list();
    jamRoomStore.set(rooms);
    fetchState.set("done");
    return rooms;
}

const filteredJams = (query: string) => derived([jamRoomStore], ([$jamRoomStore]) => {
    if (query === '') return $jamRoomStore;
    return fuzzysort.go(query, $jamRoomStore, {
        all: false,
        key: 'name',
    }).map((res) => res.obj);
});

export function getFilteredJams(query: string) {
    return get(filteredJams(query));
}