<script lang="ts">
    import type { PianoKeyNote } from '@lib/types/jam';
    import { genPianoKeys } from '@lib/utils/piano';
    import { JamPianoStore } from '@store/jam';
    import Select from '../global/Select.svelte';
    import PianoOctave from './PianoOctave.svelte';

    const sizes = [49, 61];
    let keyboardSize: 49 | 61 = 49;
    let keyboard: PianoKeyNote[][];

    function handleKeyUp() {
        JamPianoStore.set({ keydown: false, currNote: null });
    }

    $: {
        keyboard = genPianoKeys(keyboardSize);
    }
</script>

<svelte:window on:mouseup={handleKeyUp} />

<div class="piano">
    <div class="controls">
        <Select
            label="Size:"
            options={sizes}
            display={(o) => o}
            bind:value={keyboardSize} />
    </div>
    <div class="wrapper">
        <div class="con">
            {#each keyboard as octave}
                <PianoOctave
                    keys={octave}
                    on:INSTRUMENT_NOTE />
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .piano {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        user-select: none;

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
            display: flex;
            align-items: center;
            justify-content: center;

            .con {
                height: 100%;
                padding: 1rem;
                display: flex;
                align-items: center;
                overflow: auto;
            }
        }
    }
</style>
