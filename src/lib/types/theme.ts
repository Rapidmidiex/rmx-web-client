export type ThemeName = `${'LIGHT' | 'DARK'}_THEME`;

export interface Theme {
    name: ThemeName;
    vars: {
        '--primary': string;
        '--primary-light': string;
        '--primary-dark': string;
        '--secondary': string;
        '--secondary-light': string;
        '--secondary-dark': string;
        '--background': string;
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
}
