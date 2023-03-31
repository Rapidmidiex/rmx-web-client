type SettingsPageName = "Playback" | "Keyboard"

interface SettingsPage {
    name: SettingsPageName,
    icon: string
}

export const settingsPages: SettingsPage[] = [
    { name: "Playback", icon: "speaker" },
    { name: "Keyboard", icon: "command" }
]

type OctaveSwitchKeyBinding = ["Minus", "Equal"] | ["KeyZ", "KeyX"]
export const octaveKeyBindings: OctaveSwitchKeyBinding[] = [["Minus", "Equal"], ["KeyZ", "KeyX"]]

type InstrumentDisplay = "Piano" | "Keyboard"
export const instrumentDisplays: InstrumentDisplay[] = ["Piano", "Keyboard"]

export interface Settings {
    currPage: SettingsPage
    keyBindings: {
        octaveSwitch: OctaveSwitchKeyBinding
    }
    instrumentDisplay: InstrumentDisplay
}
