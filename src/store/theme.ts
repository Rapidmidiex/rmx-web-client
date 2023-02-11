import { DARK_THEME, LIGHT_THEME } from '@lib/consts/theme';
import type { Theme, ThemeName } from '@lib/types/theme';
import { writable } from 'svelte/store';

export let themes: Theme[] = [
    {
        name: LIGHT_THEME,
        colors: {
            '--main-fg': '#000',
            '--main-bg': '#fff',
            '--main-text': '#000',
            '--icon-text': '#000',
            '--button-text': '#fff',
            '--input-text': '#000',
            '--input-bg': '#cacaca',
            '--button-bg': '#000',
            '--icon-bg': 'transparent',
            '--shadow': '0 0 0.5rem #000',
        },
    },
    {
        name: DARK_THEME,
        colors: {
            '--main-fg': '#fff',
            '--main-bg': '#222',
            '--main-text': '#fff',
            '--icon-text': '#fff',
            '--button-text': '#000',
            '--input-text': '#fff',
            '--input-bg': '#444',
            '--button-bg': '#fff',
            '--icon-bg': 'transparent',
            '--shadow': '0 0 0.5rem #fff',
        },
    },
];

const getTheme = (name: ThemeName): Theme =>
    themes.find((t) => t.name === name);

export const themeStore = writable<Theme>(getTheme(LIGHT_THEME));

export const switchTheme = (name: ThemeName) => {
    themeStore.set(getTheme(name));
};

export const applyTheme = (theme: Theme) => {
    return Object.entries({ ...theme }).reduce(
        (s, [n, v]) => `${s}${n}:${v};`,
        ''
    );
};
