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

/** WebSocket base */
const ws = config.apiBaseUrl.replace(/^http/, 'ws');

export const agent = {
    jams: {
        create: async (body: CreateJamRoom) => {
            const { data } = await api.post<JamRoom>('/jams', body);

            return data;
        },
        list: async () => {
            const { data: { rooms } } = await api.get<{ rooms: JamRoom[]; }>('/jams');

            return rooms;
        },
        get: async (id: string) => {
            const { data } = await api.get<JamRoom>(`/jams/${id}`);

            return data;
        },
        ws: (id: string) => {
            return new WebSocket(ws + `/jams/${id}/ws`);
        },
    },
    redirect: {
        jam: (id: string) => navigate(`jam/${id}`),
        home: () => navigate('/'),
    },
} as const;
