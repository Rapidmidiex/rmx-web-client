<script lang="ts">
    import { genPianoKeys } from '@lib/utils/piano';
    import PianoOctave from './PianoOctave.svelte';

    const keyboard = genPianoKeys(49);
</script>

<div class="piano">
    {#each keyboard as octave}
        <PianoOctave keys={octave} />
    {/each}
</div>

<style lang="scss">
    .piano {
        width: 100%;
        height: 18rem;
        padding: 1rem;
        display: flex;
        overflow: auto;
        user-select: none;
        background-color: #000;
    }
</style>
