import { THEME_STORE } from '@lib/consts/store';
import storage from '@lib/services/store/store';
import type { Theme, ThemeName } from '@lib/types/theme';
import { writable } from 'svelte/store';

export let themes: Theme[] = [
    {
        name: 'LIGHT_THEME',
        vars: {
            '--primary': '#8400ff',
            '--primary-light': '#a03bff',
            '--primary-dark': '#5b00b0',
            '--secondary': '#03dac4',
            '--secondary-light': '#66fff7',
            '--secondary-dark': '#00a794',
            '--background': '#ffffff',
            '--background-hover': '#dddddd',
            '--background-focus': '#cccccc',
            '--surface': '#ffffff',
            '--error': '#b00020',
            '--on-primary': '#ffffff',
            '--on-secondary': '#000000',
            '--on-background': '#000000',
            '--on-surface': '#000000',
            '--on-error': '#ffffff',
            '--shadow': '0 0 1rem rgba(0, 0, 0, 0.3)',
            '--shadow-light': '0 0 0.5rem rgba(0, 0, 0, 0.3)',
            '--border': '1px solid #000000',
            '--border-color': '#000000',
            '--border-radius': '0.3rem',
        },
    },
    {
        name: 'DARK_THEME',
        vars: {
            '--primary': '#8400ff',
            '--primary-light': '#a03bff',
            '--primary-dark': '#5b00b0',
            '--secondary': '#03dac4',
            '--secondary-light': '#66fff7',
            '--secondary-dark': '#00a794',
            '--background': '#333333',
            '--background-hover': '#444444',
            '--background-focus': '#555555',
            '--surface': '#333333',
            '--error': '#b00020',
            '--on-primary': '#ffffff',
            '--on-secondary': '#000000',
            '--on-background': '#ffffff',
            '--on-surface': '#ffffff',
            '--on-error': '#ffffff',
            '--shadow': '0 0 1rem rgba(0, 0, 0, 0.3)',
            '--shadow-light': '0 0 0.5rem rgba(0, 0, 0, 0.3)',
            '--border': '1px solid #000000',
            '--border-color': '#000000',
            '--border-radius': '0.3rem',
        },
    },
];

const getOSTheme = (): ThemeName => {
    const prefersDarkMq = window.matchMedia('(prefers-color-scheme: dark)');
    return prefersDarkMq.matches ? 'DARK_THEME' : 'LIGHT_THEME';
};

const getTheme = (name: ThemeName): Theme =>
    themes.find((t) => t.name === name);

export const themeStore = storage<Theme>(THEME_STORE, getTheme(getOSTheme()));

export const switchTheme = (name: ThemeName) => {
    themeStore.set(getTheme(name));
};

export const applyTheme = (theme: Theme) => {
    return Object.entries(theme).reduce((s, [n, v]) => `${s}${n}:${v};`, '');
};
