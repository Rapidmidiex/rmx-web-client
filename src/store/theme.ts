import { THEME_CTX } from '@lib/consts/contexts';
import { LIGHT_THEME } from '@lib/consts/theme';
import type { Theme } from '@lib/types/theme';
import { setContext } from 'svelte';
import { writable } from 'svelte/store';

export let themes = [
	{
		name: LIGHT_THEME,
		colors: {
			main: {
				fg: '#000',
				bg: '#fff',
				text: "#000"
			},
			text: {
				input: "#000",
				button: "#fff",
				icon: "#fff"
			},
			bg: {
				input: "#dadada",
				button: "#000",
				icon: "#000",
			}
		},
		shadow: "0 0 0.5rem #000"
	}]

const getTheme = (name: string): Theme => themes.find(t => t.name === name)

const Theme = writable<Theme>(getTheme(LIGHT_THEME));

setContext(THEME_CTX, {
	theme: Theme,
	set: (name: string) => {
		Theme.set(getTheme(name))
	}
})


