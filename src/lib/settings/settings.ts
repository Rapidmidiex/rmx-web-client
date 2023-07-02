import { Icons } from '@assets/icons';

type SettingsPageName = 'Playback' | 'Keyboard';

interface SettingsPage {
    name: SettingsPageName;
    icon: string;
}

export const settingsPages: SettingsPage[] = [
    { name: 'Playback', icon: Icons.MusicalNotes },
    { name: 'Keyboard', icon: Icons.Text },
];

type OctaveSwitchKeyBinding = ['-', '='] | ['z', 'x'];
export const octaveKeyBindings: OctaveSwitchKeyBinding[] = [
    ['-', '='],
    ['z', 'x'],
];

type InstrumentDisplay = 'Piano' | 'Keyboard';
export const instrumentDisplays: InstrumentDisplay[] = ['Piano', 'Keyboard'];

export interface Settings {
    currPage: SettingsPage;
    keyBindings: {
        octaveSwitch: OctaveSwitchKeyBinding;
    };
    instrumentDisplay: InstrumentDisplay;
}
