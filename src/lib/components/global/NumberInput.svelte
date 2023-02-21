<script lang="ts">
    import { applyTheme, themeStore } from '@store/theme';

    export let placeholder = '';
    export let disabled: boolean = false;
    export let value: number;

    let vars;
    $: vars = $themeStore.vars;
</script>

<input
    style={applyTheme(vars)}
    type="number"
    {placeholder}
    {disabled}
    on:input
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
