import { writable } from "svelte/store"
import { settingsPages, type Settings } from "./settings"

function createSettings() {
    const { subscribe, set, update } = writable<Settings>({
        currPage: settingsPages[1],
        keyBindings: {
            octaveSwitch: ["Minus", "Equal"]
        }
    })

    return {
        subscribe,
        set,
        update
    }
}

export const settingsStore = createSettings()
