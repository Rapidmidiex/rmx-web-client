<script lang="ts">
    import { applyTheme, themeStore } from '@store/theme';

    export let label: String;
    export let options: any[] = [];
    export let display: Function = (o: any) => o;
    export let value: any;

    let vars;
    $: vars = $themeStore.vars;
</script>

<label>
    {label}
    <select
        style={applyTheme(vars)}
        on:change
        bind:value>
        {#each options as opt}
            <option value={opt}>{display(opt)}</option>
        {/each}
    </select>
</label>

<style lang="scss">
    select {
        padding: 0.5rem 1rem;
        outline: none;
        border: none;
        background-color: var(--input-bg);
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
        border-bottom: var(--input-border);
        color: var(--input-text);
        transition: 0.3s ease;
    }
    select:hover {
        background-color: var(--input-bg-hover);
    }

    select:focus {
        background-color: var(--input-bg-focus);
        border-bottom: var(--input-border-focus);
    }
</style>
