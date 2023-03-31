<script lang="ts">
    import { type KeyNote } from '@lib/audio/keyboard';
    import PianoKey from './PianoKey.svelte';

    export let notes: KeyNote[];

    const keyBindings = "AWSDRFTGHUJIKOL;['";
    $: keys = notes.map((note, idx) => ({
        note: note,
        binding: keyBindings[idx],
    }));
</script>

<div class="piano">
    <div class="wrapper">
        {#each keys as key, i}
            <PianoKey
                {key}
                index={i} />
        {/each}
    </div>
</div>

<style lang="scss">
    .piano {
        height: 15rem;
        display: flex;
        align-items: center;
        justify-content: center;

        .wrapper {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            position: relative;
            gap: 0.3rem;
        }
    }
</style>
