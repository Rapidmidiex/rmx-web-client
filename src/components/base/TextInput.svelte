<script lang="ts">
    import { themeStore, applyTheme } from '@lib/theme';

    export let placeholder = '';
    export let disabled = false;
    export let value: string;
</script>

<input
    style={applyTheme($themeStore)}
    type="text"
    {placeholder}
    {disabled}
    on:input
    on:keydown|stopPropagation
    bind:value />

<style lang="scss">
    input {
        padding: 1rem;
        outline: none;
        border: none;
        background-color: var(--background);
        border-radius: var(--border-radius);
        border: 3px solid var(--background-accent);
        color: var(--on-background);
        transition: 0.3s ease;
    }

    input:focus {
        background-color: var(--background-focus);
        border-color: var(--primary);
    }
</style>
