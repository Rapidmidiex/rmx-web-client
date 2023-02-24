import type { Jam } from '@lib/types/jam';
import { writable, type Readable, type Subscriber } from 'svelte/store';

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

// 
export const createJamStore = (init: Jam) => {
    const { subscribe, update, set } = writable<Jam>(init);

    const setDevice = (...devices: MediaDeviceInfo[]) => {
        update((store) => ({
            ...store,
            availableDevices: devices,
        }));
    };

    const broadcast = (data: any) => {
        update((store) => {
            if (store.ws) {
                store.ws.send(JSON.stringify(data));
            }
            return store;
        });

    };

    return {
        subscribe,
        setDevice,
        /** broadcast a message via the websocket connection */
        broadcast,
    };
};

export const jamStore = createJamStore({
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
