import axios from 'axios';
import { navigate } from 'svelte-navigator';
import { config } from '../../config';

const api = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

type CreateJamRoom = {
    name: string;
    capacity: number;
    bpm: number;
};

export type JamRoom = {
    id: string;
    name: string;
    capacity: number;
    bpm: number;
};

export const agent = {
    jams: {
        create: (body: CreateJamRoom) => {
            // TODO -- handle promise here
            return api.post<JamRoom>('/jams', body);
        },
        list: () => {
            return api.get<{ rooms: JamRoom[] }>('/jams');
        },
        get: (id: string) => {
            return api.get<JamRoom>(`/jams/${id}`);
        },
        ws: (id: string) => {
            return createWebsocket(`/jams/${id}`);
        },
    },
    redirect: {
        jam: (id: string) => navigate(`jam/${id}`),
        home: () => navigate('/'),
    },
} as const;

const createWebsocket = (pathId = '/') => {
    const ws = config.apiBaseUrl.replace(/^http/, 'ws');
    return new WebSocket(ws + pathId + '/ws');
};
