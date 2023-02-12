import type { Writable } from 'svelte/store';

export type ThemeName = `${string}_THEME`;

export interface Theme {
    name: ThemeName;
    vars: {
        '--primary-color': string;
        '--secondary-color': string;
        '--main-bg': string;
        '--main-bg-inverse': string;
        '--main-fg': string;
        '--main-fg-inverse': string;
        '--main-text': string;
        '--main-text-inverse': string;
        '--button-text': string;
        '--button-text-hover': string;
        '--button-text-inverse': string;
        '--input-text': string;
        '--button-bg': string;
        '--button-bg-hover': string;
        '--button-bg-inverse': string;
        '--input-bg': string;
        '--input-bg-hover': string;
        '--input-bg-focus': string;
        '--input-bg-inverse': string;
        '--input-border': string;
        '--input-border-focus': string;
        '--border': string;
        '--border-color': string;
        '--border-radius': string;
        '--shadow': string;
    };
}
