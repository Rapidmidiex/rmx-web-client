import { storage } from '@lib/services/store/store';
import type { Theme, ThemeName } from '@lib/types/theme';

export let themes: Theme[] = [
    {
        name: 'LIGHT_THEME',
        vars: {
            '--primary': '#00993e',
            '--primary-light': '#00cb6a',
            '--primary-dark': '#006912',
            '--secondary': '#58a7ba',
            '--secondary-light': '#9be9fc',
            '--secondary-dark': '#006a7b',
            '--background': '#ffffff',
            '--background-accent': '#e5e5e5',
            '--background-hover': '#dddddd',
            '--background-focus': '#cccccc',
            '--surface': '#ffffff',
            '--error': '#b00020',
            '--on-primary': '#ffffff',
            '--on-secondary': '#ffffff',
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
            '--primary': '#00993e',
            '--primary-light': '#00cb6a',
            '--primary-dark': '#006912',
            '--secondary': '#35889a',
            '--secondary-light': '#58a7ba',
            '--secondary-dark': '#006a7b',
            '--background': '#333333',
            '--background-accent': '#444444',
            '--background-hover': '#444444',
            '--background-focus': '#555555',
            '--surface': '#333333',
            '--error': '#b00020',
            '--on-primary': '#ffffff',
            '--on-secondary': '#ffffff',
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

export const themeStore = storage<Theme>('THEME_STORE', getTheme(getOSTheme()));

export const switchTheme = (name: ThemeName) => {
    themeStore.set(getTheme(name));
};

export const applyTheme = (theme: Theme) => {
    return Object.entries(theme).reduce((s, [n, v]) => `${s}${n}:${v};`, '');
};
