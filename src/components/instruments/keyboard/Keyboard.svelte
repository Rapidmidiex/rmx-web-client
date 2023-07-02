<script lang="ts">
    import type { KeyNote } from '@lib/audio/keyboard';
    import KeyboardKey from './KeyboardKey.svelte';

    export let notes: KeyNote[];
    const topRowBindings = 'WETYUO[';
    const bottomRowBindings = "ASDFGHJKL;'";
    $: topRowKeys = notes
        .filter((note) => note.note.black === true)
        .map((note, idx) => ({ note: note, binding: topRowBindings[idx] }));
    $: bottomRowKeys = notes
        .filter((note) => note.note.black === false)
        .map((note, idx) => ({ note: note, binding: bottomRowBindings[idx] }));
</script>

<div class="keyboard">
    <div class="row">
        {#each topRowKeys as key}
            <KeyboardKey {key} />
        {/each}
    </div>
    <div class="row">
        {#each bottomRowKeys as key}
            <KeyboardKey {key} />
        {/each}
    </div>
</div>

<style lang="scss">
    .keyboard {
        height: 15rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .row {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
    }
</style>
