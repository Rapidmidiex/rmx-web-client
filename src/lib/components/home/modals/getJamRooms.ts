import { Agent } from "@api/api";
import type { GetJamData } from "@lib/types/jam";
import fuzzysort from "fuzzysort";
import { get, writable } from "svelte/store";

export const jamRoomStore = writable<GetJamData[]>([]);
export const fetchState = writable<"loading" | "done">("loading");

export async function getJamRooms() {
    console.log("hello");
    const { data: { rooms } } = await Agent.Jams.list();
    jamRoomStore.set(rooms);
    fetchState.set("done");
    return rooms;
}

export function fuzzySearch(query: string) {
    const rooms = get(jamRoomStore);
    if (query === '') return rooms;

    return fuzzysort.go(query, rooms, {
        all: false,
        key: 'name',
    }).map((res) => res.obj);
}
