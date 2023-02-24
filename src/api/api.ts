import type { CreateJamData, GetJamData } from "@lib/types/jam";
import axios from 'axios';
import { navigate, type NavigateOptions } from "svelte-navigator";
import cfg from '../config';

const api = axios.create({
    baseURL: cfg.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// TODO -- add agent for jams

export const Agent = {
    Jams: {
        create: (body: CreateJamData) => {
            // TODO -- handle promise here
            return api.post<GetJamData>("/jams", JSON.stringify(body));
        },
        list: () => {
            return api.get("/jams");
        },
        get: (id: string) => {
            return api.get<GetJamData>(`/jams/${id}`);
        },
        ws: (id: string) => {
            return createWebsocket(`/jams/${id}`);
        }
    },
    Redirect: {
        jam: (id: string) => {
            let opt: NavigateOptions = { replace: true };
            navigate(`jam/${id}`, opt);
        },
        home: () => {
            navigate("/", { replace: true });
        }
    }
} as const;

export const createWebsocket = (pathId = "/") => {
    const ws = cfg.apiBaseUrl.replace(/^http/, 'ws');
    return new WebSocket(ws + pathId + "/ws");
};