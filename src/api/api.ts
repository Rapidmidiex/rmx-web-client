import axios from 'axios';

const { VITE_RMX_API_BASE } = import.meta.env;

export const BASE_URL = VITE_RMX_API_BASE ?? 'localhost:8888'

export const api = axios.create({
    baseURL: `http://${BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});
