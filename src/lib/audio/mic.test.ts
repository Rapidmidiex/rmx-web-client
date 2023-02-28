import { describe, expect, it } from 'vitest';
import { noteFromPitch } from './mic';

describe('noteFromPitch()', () => {
    const cases: { expectedMidi: number; pitch: number }[] = [
        // Control
        { pitch: 440, expectedMidi: 69 },
        { pitch: 261.6, expectedMidi: 60 },
        // Handle out of bounds frequencies
        { pitch: 0, expectedMidi: null },
        { pitch: 15_000, expectedMidi: null },
        // Handle out of tune frequencies
        { pitch: 8, expectedMidi: 0 },
        { pitch: 21.533203125, expectedMidi: 17 },
        { pitch: 43.06640625, expectedMidi: 29 },
        { pitch: 64.599609375, expectedMidi: 36 },
        { pitch: 86.1328125, expectedMidi: 41 },
        { pitch: 129.19921875, expectedMidi: 48 },
        { pitch: 258.3984375, expectedMidi: 60 },
        { pitch: 753.662109375, expectedMidi: 78 },
    ];
    cases.forEach(({ expectedMidi, pitch }) => {
        it(`should return MIDI: ${expectedMidi} for freq: ${pitch}hz`, () => {
            const actual = noteFromPitch(pitch);
            expect(actual).to.eq(expectedMidi);
        });
    });
});
