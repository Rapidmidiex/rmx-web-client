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
        background-color: var(--background);
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
        border-bottom: 3px solid var(--on-background);
        color: var(--on-background);
        transition: 0.3s ease;
    }

    input:focus {
        background-color: var(--background-focus);
        border-color: var(--primary-light);
    }
</style>
