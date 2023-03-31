<script lang="ts">
    import Select from '@components/base/Select.svelte';
    import {
        instrumentDisplays,
        octaveKeyBindings,
    } from '@lib/settings/settings';
    import { settingsStore } from '@lib/settings/index';
</script>

<div>
    <Select
        label="Octave switch bindings"
        options={octaveKeyBindings}
        bind:value={$settingsStore.keyBindings.octaveSwitch} />
    <Select
        label="Instrument display"
        options={instrumentDisplays}
        bind:value={$settingsStore.instrumentDisplay} />
</div>

<style lang="scss">
    div {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 1rem;
    }
</style>
