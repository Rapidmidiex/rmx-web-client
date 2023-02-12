<script lang="ts">
    import { applyTheme, themeStore } from '@store/theme';

    export let placeholder = '';
    export let disabled: boolean = false;
    export let value: string;

    let vars;
    $: vars = $themeStore.vars;
</script>

<input
    style={applyTheme(vars)}
    type="text"
    {placeholder}
    {disabled}
    on:input
    bind:value />

<style lang="scss">
    input {
        padding: 1rem;
        outline: none;
        border: none;
        background-color: var(--input-bg);
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
        border-bottom: var(--input-border);
        color: var(--input-text);
        transition: 0.3s ease;
    }

    input:focus {
        background-color: var(--input-bg-focus);
        border-bottom: var(--input-border-focus);
    }
</style>
