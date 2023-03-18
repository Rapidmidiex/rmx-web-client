<script lang="ts">
    import { KeyboardStore, type KeyNote } from '@lib/audio/keyboard';
    import { applyTheme, themeStore } from '@lib/theme';

    export let label: string;
    export let key: KeyNote;

    function handlePress() {
        $KeyboardStore.keydown = true;
        $KeyboardStore.currNote = key;
    }

    function handleKeyEnter() {
        if (!$KeyboardStore.keydown) {
            return;
        }
        $KeyboardStore.currNote = key;
    }
</script>

<button
    type="button"
    on:mousedown={handlePress}
    on:mouseenter={handleKeyEnter}
    on:focus
    style={applyTheme($themeStore)}
    class="key">
    <!-- TODO: Switch label type in settings -->
    <p>{label}</p>
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
        padding: 2rem;
        margin: 0.5rem;
    }

    .key:hover {
        background-color: var(--border-color);
    }
</style>
