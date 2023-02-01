<script lang="ts">
    import PianoKey from './PianoKey.svelte';
    import { genPianoKeys } from 'src/lib/utils/piano';

    const keyboard = genPianoKeys(61);
</script>

<div class="piano">
    {#each keyboard as octave}
        {#each octave as key}
            <PianoKey {key} />
        {/each}
    {/each}
</div>

<style lang="scss">
    .piano {
        width: 100%;
        height: 25rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        overflow: auto;
        user-select: none;
    }
</style>
