<script lang="ts">
    import type { PianoKeyNote } from 'src/lib/types/jam';
    import { JamPianoStore } from 'src/store/jam';

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
    class={`key ${key.black ? 'black' : ''} ${
        $JamPianoStore.currNote === key ? 'pressed' : ''
    }`}>
    <p>{key.name[0]}</p>
</div>

<style lang="scss">
    .key {
        height: 100%;
        padding: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        border: 1px solid #000;
        box-shadow: 0 0.5rem 0 #000;
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

    .black {
        background-color: #000;
        border: 1px solid #fff;

        p {
            font-size: 0.8rem;
            color: #fff;
        }
    }

    .black:hover {
        background-color: #333;
    }

    .pressed {
        box-shadow: none;
    }
</style>
