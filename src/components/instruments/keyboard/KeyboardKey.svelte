<script lang="ts">
    import { KeyboardStore, type KeyWithBinding } from '@lib/audio/keyboard';
    import { applyTheme, themeStore } from '@lib/theme';

    export let key: KeyWithBinding;

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
    type="button"
    on:mousedown={handlePress}
    on:mouseenter={handleKeyEnter}
    on:focus
    style={applyTheme($themeStore)}
    class="key">
    <p class="name">{key.note.note.name[0]} | {key.note.note.name[1]}</p>
    <!-- TODO: Switch label type in settings -->
    <p class="binding">{key.binding}</p>
</button>

<style lang="scss">
    .key {
        border: 1px solid var(--border-color);
        outline: none;
        background-color: var(--background-accent);
        color: var(--on-background);
        border-radius: var(--border-radius);
        font-size: 1rem;
        cursor: pointer;
        transition: 0.3s ease;
        width: 6rem;
        height: 6rem;
        margin: 0.5rem;
        position: relative;
        overflow: hidden;

        .binding {
            position: absolute;
            width: 100%;
            padding: 0.3rem;
            background-color: var(--primary);
            bottom: 0;
            font-weight: bold;
            color: var(--on-primary);
        }
    }

    .key:hover {
        background-color: var(--border-color);
    }
</style>
