<script lang="ts">
    import type { PianoKeyNote } from '@lib/types/jam';
    import { JamPianoStore } from '@store/jam';

    export let key: PianoKeyNote;

    function handleKeydown() {
        JamPianoStore.set({ keydown: true, currNote: key });
    }

    function handleKeyOver() {
        if ($JamPianoStore.keydown) {
            JamPianoStore.update((v) => {
                return {
                    ...v,
                    currNote: key,
                };
            });
        }
    }

    function handleKeyup() {
        JamPianoStore.set({ keydown: false, currNote: null });
    }
</script>

<div
    on:mousedown={handleKeydown}
    on:mouseover={handleKeyOver}
    on:mouseup={handleKeyup}
    on:focus
    class="key"
    class:pressed={$JamPianoStore.currNote === key}>
    <p>{key.name[0]}</p>
</div>

<style lang="scss">
    .key {
        width: 2rem;
        height: 100%;
        padding: 0.5rem;
        margin: 0.1rem;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        background-color: #fff;
        transition: 0.3s ease;
        cursor: pointer;

        p {
            color: #000;
            font-size: 1rem;
        }
    }

    .key:hover {
        background-color: #dadada;
    }

    .pressed {
        box-shadow: none;
    }
</style>
