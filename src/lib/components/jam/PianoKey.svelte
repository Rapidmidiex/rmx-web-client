<script lang="ts">
    import { AS, CS, DS, FS, GS } from '@lib/consts/piano';
    import type { PianoKeyNote } from '@lib/types/jam';
    import { PianoStore } from '@store/piano';
    import { applyTheme, themeStore } from '@store/theme';

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

    function handleKeyDown() {
        $PianoStore = { keydown: true, currNote: key };
    }

    function handleKeyEnter() {
        if (!$PianoStore.keydown) {
            return;
        }

        $PianoStore.currNote = key;
    }

    let vars;
    $: vars = $themeStore.vars;
</script>

<div
    on:mousedown={handleKeyDown}
    on:mouseenter={handleKeyEnter}
    on:focus
    style={applyTheme(vars) +
        `${black ? `left: ${keySpacing * 2.2 + 1 + 2 * 0.2}rem;` : ''}`}
    class="key"
    class:black
    class:pressed={$PianoStore.currNote === key}>
    <p>{key.note.name[0]}</p>
</div>

<style lang="scss">
    .key {
        width: 2rem;
        height: 100%;
        padding: 0.5rem;
        margin: 0.1rem;
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        background-color: #fff;
        box-shadow: 0 0.3rem 0.3rem #555;
        transition: 0.3s ease;
        cursor: pointer;

        p {
            color: #000;
            font-size: 1rem;
        }
    }

    .key:hover {
        background-color: #dadada;
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
