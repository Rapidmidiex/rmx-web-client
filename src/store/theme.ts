import type { Theme } from 'src/lib/types/theme';
import { writable } from 'svelte/store';

const light: Theme = {
    fg: '#000',
    bg: '#fff',
    text: '#000',
    icon: '#000',
};

const dark: Theme = {
    fg: '#fff',
    bg: '#000',
    text: '#fff',
    icon: '#fff',
};

export const theme = writable<Theme>(light);

export function toggleLightTheme() {
    theme.set(light);
}

export function toggleDarkTheme() {
    theme.set(dark);
}
