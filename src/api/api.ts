import axios from 'axios';
import cfg from '../config';

export const api = axios.create({
    baseURL: cfg.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log(cfg.wsBaseUrl)

export const createWebsocket = (url = "/") =>{
    return new WebSocket(cfg.wsBaseUrl+url);
}