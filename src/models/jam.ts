export interface Jam {
    id: string;
    name: string;
    bpm: number;
    users: string[];
}

export interface CreateJamData {
    name: string;
    capacity: number;
    bpm: number;
}

export interface GetJamData {
    id: string;
    name: string;
    bpm: number;
}