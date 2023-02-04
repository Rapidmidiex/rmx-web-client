<script lang="ts">
    import type { PianoKeyNote } from '@lib/types/jam';
    import PianoKey from './PianoKey.svelte';
    export let keys: PianoKeyNote[];
</script>

<div class="octave">
    {#each keys as key}
        <PianoKey
            {key}
            black={key.note.black}
            on:INSTRUMENT_NOTE />
    {/each}
</div>

<style lang="scss">
    .octave {
        position: relative;
        height: 100%;
        display: flex;
    }
</style>
