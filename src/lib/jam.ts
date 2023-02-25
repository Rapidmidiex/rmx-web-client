import { writable } from "svelte/store";

export interface Jam {
    id: string;
    name: string;
    capacity: number;
    bpm: number;
    players: string[];
    ws: WebSocket;
    audioInputDevice: MediaDeviceInfo | null;
    availableDevices: MediaDeviceInfo[];
}

export const JamStore = writable<Jam>({
    id: '',
    name: '',
    capacity: 5,
    bpm: 90,
    players: [],
    ws: null,
    audioInputDevice: null,
    availableDevices: [],
});

export function setAudioDevice(device: MediaDeviceInfo) {
    JamStore.update((store) => ({
        ...store,
        audioInputDevice: device,
    }));
}
export function setAvailableDevices(devices: MediaDeviceInfo[]) {
    JamStore.update((store) => ({
        ...store,
        availableDevices: devices,
    }));
}
