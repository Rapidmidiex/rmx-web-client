<script lang="ts">
    export let label: String;
    export let options: any[] = [];
    export let display: Function = (o: any) => o;
    export let value: any;
</script>

<label>
    {label}
    <select
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
        background-color: #eaeaea;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        border-bottom: 3px solid #808080;
        transition: 0.3s ease;
    }

    select:focus {
        background-color: #cfcfcf;
        border-bottom: 3px solid #000;
    }
</style>
