import { A, AS, B, C, CS, D, DS, E, F, FS, G, GS } from "@lib/consts/piano";
import type { KeyBinding, PianoKeyNote } from "@lib/types/jam";

const octaveNotes: PianoKeyNote[] = [
	{ midi: 21, note: A },
	{ midi: 22, note: AS },
	{ midi: 23, note: B },
	{ midi: 24, note: C },
	{ midi: 25, note: CS },
	{ midi: 26, note: D },
	{ midi: 27, note: DS },
	{ midi: 28, note: E },
	{ midi: 29, note: F },
	{ midi: 30, note: FS },
	{ midi: 31, note: G },
	{ midi: 32, note: GS },
];

export const keyBindings: KeyBinding[] = [
	{ keyName: "a", isAccidental: false },
	{ keyName: "w", isAccidental: true },
	{ keyName: "s", isAccidental: false },
	{ keyName: "e", isAccidental: true },
	{ keyName: "d", isAccidental: false },
	{ keyName: "f", isAccidental: false },
	{ keyName: "t", isAccidental: true },
	{ keyName: "g", isAccidental: false },
	{ keyName: "y", isAccidental: true },
	{ keyName: "h", isAccidental: false },
	{ keyName: "u", isAccidental: true },
	{ keyName: "j", isAccidental: false },
	{ keyName: "k", isAccidental: false },
	{ keyName: "o", isAccidental: true },
	{ keyName: "l", isAccidental: false },
	{ keyName: "p", isAccidental: true },
	{ keyName: ";", isAccidental: false },
	{ keyName: "'", isAccidental: false },
];

export function genPianoKeys(
	size: 49 | 61,
	bindings: KeyBinding[]
): {
	keyMap: Record<KeyBinding["keyName"], number>;
	keyboard: PianoKeyNote[][];
} {
	let notes: PianoKeyNote[] = [];
	let startIdx: number;
	let firstNoteMIDI: number;
	const keyMap = {};
	switch (size) {
		case 49:
			startIdx = 3;
			break;
		case 61:
			startIdx = 3;
			break;
		// case 76:
		//     startIdx = 7;
		//     break;
		// case 88:
		//     startIdx = 0;
		//     break;
		default:
			startIdx = 3;
	}

	firstNoteMIDI = 21 + startIdx;

	for (let i = 0, j = 0; i < size; i++) {
		const { note } =
			octaveNotes[((i % octaveNotes.length) + startIdx) % octaveNotes.length];
		const midi = i + firstNoteMIDI;
		const n: PianoKeyNote = {
			midi,
			note,
		};

		if (note.name[0] === "C" && j == 0) {
			j++;
		}
		if (j > 0 && j <= bindings.length) {
			const binding = bindings[j - 1];
			n.binding = binding;
			keyMap[binding.keyName] = midi;
			j++;
		}

		notes.push(n);
	}

	return {
		keyMap,
		keyboard: chunkBy(notes, octaveNotes.length),
	};
}

function chunkBy<T>(arr: T[], chunkSize: number): T[][] {
	let result: T[][] = [];

	for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize);
		result.push(chunk);
	}

	return result;
}
