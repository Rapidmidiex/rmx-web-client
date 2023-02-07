import type { Jam, PianoState, TextMsg } from '@lib/types/jam';
import type { WSMsg } from '@lib/types/websocket';
import { writable } from 'svelte/store';

const pianoStateDefault: PianoState = {
    keydown: false,
    currNote: null,
};

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

export const JamTextStore = writable<WSMsg<TextMsg>[]>([]);
export const JamPianoStore = writable<PianoState>(pianoStateDefault);

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
