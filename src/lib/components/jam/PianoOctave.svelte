<script lang="ts">
    import type { PianoKeyNote } from '@lib/types/jam';
    import PianoBlackKey from './PianoBlackKey.svelte';
    import PianoKey from './PianoKey.svelte';
    export let keys: PianoKeyNote[];
</script>

<div class="octave">
    {#each keys as key}
        {#if !key.note.black}
            <PianoKey {key} />
        {:else}
            <PianoBlackKey {key} />
        {/if}
    {/each}
</div>

<style lang="scss">
    .octave {
        position: relative;
        height: 100%;
        display: flex;
    }
</style>
