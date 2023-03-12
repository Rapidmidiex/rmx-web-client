<script lang="ts">
    import type { PianoKeyNote } from '@lib/audio/piano';
    import PianoKey from './PianoKey.svelte';
    export let keys: PianoKeyNote[] = [];
</script>

<div class="octave">
    {#each keys as key, index}
        <PianoKey
            {index}
            {key}
            black={key.note.black} />
    {/each}
</div>

<style lang="scss">
    .octave {
        position: relative;
        height: 100%;
        display: flex;
    }
</style>
