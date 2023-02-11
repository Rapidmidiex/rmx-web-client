import type { Writable } from 'svelte/store';

export type ThemeName = `${string}_THEME`;

export interface Theme {
    name: ThemeName;
    colors: {
        '--main-bg': string;
        '--main-fg': string;
        '--main-text': string;
        '--button-text': string;
        '--icon-text': string;
        '--input-text': string;
        '--button-bg': string;
        '--icon-bg': string;
        '--input-bg': string;
        '--shadow': string;
    };
}
