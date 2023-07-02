import { createStorage } from "@lib/storage"
import { settingsPages, type Settings } from "./settings"

function createSettings() {
    const { subscribe, set, update } = createStorage<Settings>("SETTINGS_STORE", {
        currPage: settingsPages[1],
        keyBindings: {
            octaveSwitch: ["Minus", "Equal"]
        },
        instrumentDisplay: "Piano"
    })

    return {
        subscribe,
        set,
        update
    }
}

export const settingsStore = createSettings()
