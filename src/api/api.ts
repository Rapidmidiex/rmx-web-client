import axios from 'axios';

const baseUrl = import.meta.env.VITE_RMX_API_BASE;

// TODO -- ask why we are using axios over `fetch` API
export const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// This helper allows us to not pass the env file all over the place
export const createWebsocket = (path: string) => {
    const wsUrl = baseUrl.replace(/^http/, 'ws');
    return new WebSocket(wsUrl + path);
};