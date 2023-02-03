<script lang="ts">
    import type { PianoKeyNote } from '@lib/types/jam';
    import { genPianoKeys } from '@lib/utils/piano';
    import Select from '../global/Select.svelte';
    import PianoOctave from './PianoOctave.svelte';

    const sizes = [49, 61];
    let keyboardSize: 49 | 61 = 49;
    let keyboard: PianoKeyNote[][];

    $: {
        keyboard = genPianoKeys(keyboardSize);
    }
</script>

<div class="piano">
    <div class="controls">
        <Select
            label="Size:"
            options={sizes}
            display={(o) => o}
            bind:value={keyboardSize} />
    </div>
    <div class="wrapper">
        {#each keyboard as octave}
            <PianoOctave
                keys={octave}
                on:INSTRUMENT_NOTE />
        {/each}
    </div>
</div>

<style lang="scss">
    .piano {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        & > div {
            width: 100%;
        }

        .controls {
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }

        .wrapper {
            height: 15rem;
            padding: 1rem;
            display: flex;
            justify-content: center;
            overflow: auto;
            user-select: none;
        }
    }
</style>
