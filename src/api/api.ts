import axios from 'axios';

const { VITE_RMX_API_BASE, VITE_RMX_WS_BASE } = import.meta.env;

export const API_BASE_URL = VITE_RMX_API_BASE ?? 'http://localhost:8888/api/v1'
export const WS_BASE_URL = VITE_RMX_WS_BASE ?? 'ws://localhost:8888/ws'

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
