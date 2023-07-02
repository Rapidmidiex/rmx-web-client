<script lang="ts">
    import {
        KeyboardStore,
        keySpacingMap,
        type KeyWithBinding,
    } from '@lib/audio/keyboard';
    import { applyTheme, themeStore } from '@lib/theme';

    export let key: KeyWithBinding;
    export let index: number;

    let spacing: number;
    $: spacing = keySpacingMap.get(index) * (4 + 0.3) + 1;

    function handlePress() {
        $KeyboardStore.keydown = true;
        $KeyboardStore.currNote = key.note;
    }

    function handleKeyEnter() {
        if (!$KeyboardStore.keydown) {
            return;
        }
        $KeyboardStore.currNote = key.note;
    }
</script>

<button
    on:mousedown={handlePress}
    on:mouseenter={handleKeyEnter}
    on:focus
    class:black={key.note.note.black}
    style={`${applyTheme($themeStore)} ${
        key.note.note.black ? 'left: ' + spacing.toString() + 'rem;' : ''
    }`}>
    <p class="name">{key.note.note.name[0]}</p>
    <!-- TODO: Switch label type in settings -->
    <p class="binding">{key.binding}</p>
</button>

<style lang="scss">
    button {
        width: 4rem;
        height: 100%;
        background-color: #fff;
        color: #000;
        border-radius: 0.3rem;
        border: none;
        outline: none;
        border-radius: 0;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        overflow: hidden;

        .name {
            padding: 0.5rem;
        }

        .binding {
            width: 100%;
            padding: 0.5rem;
            background-color: var(--primary);
            color: var(--on-primary);
            font-weight: bold;
        }
    }

    button.black {
        width: 3rem;
        height: 8rem;
        background-color: #000;
        color: #fff;
        position: absolute;
        top: 0;
    }
</style>
