import { THEME_STORE } from '@lib/consts/store';
import storage from '@lib/services/store/store';
import type { Theme, ThemeName } from '@lib/types/theme';
import { writable } from 'svelte/store';

export let themes: Theme[] = [
	{
		name: 'LIGHT_THEME',
		vars: {
			'--primary-color': '#00ff9a',
			'--secondary-color': '#000',
			'--main-fg': '#000',
			'--main-fg-inverse': '#fff',
			'--main-bg': '#fff',
			'--main-bg-secondary': '#ddd',
			'--main-bg-inverse': '#000',
			'--main-text': '#000',
			'--main-text-inverse': '#fff',
			'--button-text': '#000',
			'--button-text-hover': '#fff',
			'--button-text-inverse': '#fff',
			'--input-text': '#000',
			'--input-bg': '#ddd',
			'--input-bg-hover': '#ccc',
			'--input-bg-focus': '#ccc',
			'--input-bg-inverse': '#222',
			'--input-border': '3px solid #888',
			'--input-border-focus': '3px solid #000',
			'--button-bg': 'transparent',
			'--button-bg-hover': '#000',
			'--button-bg-inverse': '#fff',
			'--bubble-bg': '#000',
			'--shadow': '0 0 1rem rgba(0, 0, 0, 0.3)',
			'--shadow-light': '0 0 0.5rem rgba(0, 0, 0, 0.3)',
			'--border': '1px solid #000',
			'--border-color': '#000',
			'--border-radius': '0.3rem',
		},
	},
	{
		name: 'DARK_THEME',
		vars: {
			'--primary-color': '#00ff9a',
			'--secondary-color': '#fff',
			'--main-fg': '#fff',
			'--main-fg-inverse': '#222',
			'--main-bg': '#333',
			'--main-bg-secondary': '#222',
			'--main-bg-inverse': '#fff',
			'--main-text': '#fff',
			'--main-text-inverse': '#000',
			'--button-text': '#fff',
			'--button-text-hover': '#000',
			'--button-text-inverse': '#fff',
			'--input-text': '#fff',
			'--input-bg': '#555',
			'--input-bg-hover': '#444',
			'--input-bg-focus': '#444',
			'--input-bg-inverse': '#ccc',
			'--input-border': '3px solid #aaa',
			'--input-border-focus': '3px solid #fff',
			'--button-bg': 'transparent',
			'--button-bg-hover': '#fff',
			'--button-bg-inverse': '#000',
			'--bubble-bg': '#ccc',
			'--shadow': '0 0 0.5rem rgba(0, 0, 0, 0.5)',
			'--shadow-light': '0 0 0.5rem rgba(0, 0, 0, 0.5)',
			'--border': '1px solid #fff',
			'--border-color': '#fff',
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
