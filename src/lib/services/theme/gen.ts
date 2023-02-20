import tinycolor from 'tinycolor2';
import type { Theme, ThemeVariant } from '@lib/types/theme';

// // work in progress
// export function genTheme(name: string, variant: ThemeVariant, primary: HEX): Theme {
// 	const color = tinycolor(primary)
// 	const dark = color.isDark()
// 	const shades = [color.lighten(), color.darken()]

// 	return {
// 		name,
// 		variant,
// 		vars: {
// 			"--primary": primary,
// 			"--primary-light": shades[0].toHex(),
// 			"--primary-dark": shades[1].toHex(),
// 			"--background": variant === 'DARK' ? '#222222' : '#ffffff',
// 			"--background-accent":
// 		}
// 	}
// }
