<script lang="ts">
    import Select from '@components/base/Select.svelte';
    import { octaveKeyBindings } from '@lib/settings/settings';
    import { settingsStore } from '@lib/settings/index';
</script>

<div class="con">
    <Select
        label="Octave switch bindings"
        options={octaveKeyBindings}
        bind:value={$settingsStore.keyBindings.octaveSwitch} />
</div>

<style lang="scss">
</style>
