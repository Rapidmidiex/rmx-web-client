export type ThemeName = `${'LIGHT' | 'DARK'}_THEME`;
export type ThemeVariant = 'LIGHT' | 'DARK';

export interface Theme {
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
}
