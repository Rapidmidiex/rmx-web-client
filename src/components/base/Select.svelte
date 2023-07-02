<script lang="ts">
    import { themeStore, applyTheme } from '@lib/theme';

    export let label: string;
    export let options: any[] = [];
    export let display = (o: any) => o;
    export let value: any;
</script>

<div style={applyTheme($themeStore)}>
    <p class="label">{label}</p>
    <select
        on:change
        bind:value>
        {#each options as opt}
            <option value={opt}>{display(opt)}</option>
        {/each}
    </select>
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;

        p {
            color: var(--on-background);
            white-space: nowrap;
        }

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
    }
</style>
