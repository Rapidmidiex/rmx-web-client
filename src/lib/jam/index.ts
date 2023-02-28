import { agent, type JamRoom } from '@lib/api';
import { MessageParser, type Message } from '@lib/message';
import { notification } from '@lib/notification';
import { writable } from 'svelte/store';

export interface JamState {
    id: string;
    name: string;
    capacity: number;
    bpm: number;
    players: string[];
    ws: WebSocket;
    audioInputDevice: MediaDeviceInfo | null;
    availableDevices: MediaDeviceInfo[];
}

function createJamSession() {
    // TODO -- this handles too much state, imo
    const { subscribe, update } = writable<JamState>({
        id: '',
        name: '',
        capacity: 5,
        bpm: 90,
        ws: null,
        audioInputDevice: null,
        availableDevices: [],
        players: [],
    });

    function setAudioDevices(devices: MediaDeviceInfo[]) {
        console.log('setAudioDevices', devices);
        update(($jamRoom) => {
            return { ...$jamRoom, availableDevices: devices };
        });
    }

    function connectWS(id: string, onmessage: (msg: Message) => void) {
        const ws = agent.jams.ws(id);

        ws.addEventListener('open', () => {
            notification.success('Connection established.');
        });

        ws.addEventListener('close', () => {
            notification.info('Connection was closed.');
        });

        ws.addEventListener('error', (e: ErrorEvent) => {
            notification.failure(e.error);
            ws.close();
        });

        ws.addEventListener('message', (e) => {
            let message = MessageParser.decode(e.data);
            onmessage(message);
        });

        ws.onerror = (event: ErrorEvent) => {
            notification.failure(event.error);
            ws.close();
        };

        ws.onclose = () => {
            notification.info('Connection was closed.');
        };

        update(($jamRoom) => {
            return { ...$jamRoom, ws };
        });
    }

    function updateRoomInfo(room: JamRoom) {
        update(($jamRoom) => {
            return { ...$jamRoom, ...room };
        });
    }

    return { subscribe, setAudioDevices, connectWS, updateRoomInfo };
}

export const jamStore = createJamSession();
