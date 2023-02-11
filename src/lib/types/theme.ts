export interface Theme {
	name: string;
	colors: {
		main: {
			fg: string;
			bg: string;
			text: string;
		};
		text: {
			button: string;
			icon: string;
			input: string;
		};
		bg: {
			button: string;
			icon: string;
			input: string;
		}
	};
	shadow: string;
}
