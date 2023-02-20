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
        background-color: var(--background);
        border-radius: var(--border-radius);
        border: 3px solid var(--background-accent);
        color: var(--input-text);
        transition: 0.3s ease;
    }

    select:focus {
        background-color: var(--background-focus);
        border-color: var(--primary);
    }
</style>
