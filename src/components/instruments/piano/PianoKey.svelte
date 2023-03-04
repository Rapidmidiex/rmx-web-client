<script lang="ts">
    import {
        type PianoKeyNote,
        PianoStore,
        AS,
        CS,
        DS,
        FS,
        GS,
        type KeyLabel,
    } from '@lib/audio/piano';
    import { applyTheme, themeStore } from '@lib/theme';

    export let key: PianoKeyNote;
    export let black: boolean;

    let keySpacing: number; // spacing for black keys only
    switch (key.note) {
        case CS:
            keySpacing = 0;
            break;
        case DS:
            keySpacing = 1;
            break;
        case FS:
            keySpacing = 3;
            break;
        case GS:
            keySpacing = 4;
            break;
        case AS:
            keySpacing = 5;
            break;
    }

    function handlePress() {
        $PianoStore = { keydown: true, currNote: key };
    }

    function handleKeyEnter() {
        if (!$PianoStore.keydown) {
            return;
        }
        $PianoStore.currNote = key;
    }

    function keyLabel(labelType: KeyLabel, key: PianoKeyNote): string {
        switch (labelType) {
            case 'binding':
                return key.binding?.keyName ?? '';
            case 'note':
                return key.note.name[0];
            case 'midi':
                return key.midi.toString();
            default:
                return key.note.name[0];
        }
    }
</script>

<div
    on:mousedown={handlePress}
    on:mouseenter={handleKeyEnter}
    on:focus
    style={applyTheme($themeStore) +
        `${black ? `left: ${keySpacing * 2.2 + 1 + 2 * 0.2}rem;` : ''}`}
    class="key"
    class:black
    class:pressed={$PianoStore.currNote === key}>
    <!-- TODO: Switch label type in settings -->
    <p>{keyLabel('binding', key)}</p>
</div>

<style lang="scss">
    .key {
        width: 2rem;
        height: 100%;
        padding: 0.5rem;
        margin: 0.1rem;
        border-bottom-left-radius: 0.3rem;
        border-bottom-right-radius: 0.3rem;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        background-color: #fff;
        box-shadow: var(--shadow);
        transition: 0.3s ease;
        cursor: pointer;

        p {
            color: #000;
            font-size: 1rem;
        }
    }

    .key:hover {
        background-color: #aaa;
    }

    .black {
        position: absolute;
        width: 1.5rem;
        height: 60%;
        margin: none;
        background-color: #000;

        p {
            color: #fff;
            font-size: 0.8rem;
        }
    }

    .black:hover {
        background-color: #333;
    }

    .pressed {
        box-shadow: none;
    }
</style>
