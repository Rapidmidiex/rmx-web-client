import { writable } from 'svelte/store';

export const createToggle = (initState: boolean) => {
    let { subscribe, update } = writable(initState);
    const toggle = () => update(($s) => !$s);
    return { subscribe, toggle };
};
