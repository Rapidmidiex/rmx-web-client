import { createStorage } from '@lib/storage';

export type ThemeName = `${string}_THEME`;
export type ThemeVariant = 'LIGHT' | 'DARK';

export type Theme = {
    name: ThemeName;
    variant: ThemeVariant;
    vars: {
        '--primary': string;
        '--primary-light': string;
        '--primary-dark': string;
        '--background': string;
        '--background-accent': string;
        '--background-hover': string;
        '--background-focus': string;
        '--surface': string;
        '--error': string;
        '--on-primary': string;
        '--on-secondary': string;
        '--on-background': string;
        '--on-surface': string;
        '--on-error': string;
        '--border': string;
        '--border-color': string;
        '--border-radius': string;
        '--shadow': string;
        '--shadow-light': string;
    };
};

export const themes: Theme[] = [
    {
        name: 'LIGHT_THEME',
        variant: 'LIGHT',
        vars: {
            '--primary': '#a93aff',
            '--primary-light': '#ce5eff',
            '--primary-dark': '#8400ff',
            '--background': '#ffffff',
            '--background-accent': '#dddddd',
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
            '--border-radius': '0.8rem',
        },
    },
    {
        name: 'DARK_THEME',
        variant: 'DARK',
        vars: {
            '--primary': '#a93aff',
            '--primary-light': '#ce5eff',
            '--primary-dark': '#8400ff',
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
            '--border-radius': '0.8rem',
        },
    },
];

const getOSTheme = (): ThemeName => {
    const prefersDarkMq = window.matchMedia('(prefers-color-scheme: dark)');
    return prefersDarkMq.matches ? 'DARK_THEME' : 'LIGHT_THEME';
};

const getTheme = (name: ThemeName): Theme =>
    themes.find((theme) => theme.name === name);

export const themeStore = createStorage<Theme>(
    'THEME_STORE',
    getTheme(getOSTheme())
);

export const switchTheme = (name: ThemeName) => {
    themeStore.set(getTheme(name));
};

export const applyTheme = (theme: Theme) => {
    return Object.entries(theme.vars).reduce(
        (s, [n, v]) => `${s}${n}:${v};`,
        ''
    );
};
