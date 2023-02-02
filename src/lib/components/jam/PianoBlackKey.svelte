<script lang="ts">
    import type { PianoKeyNote } from '@lib/types/jam';
    import { JamPianoStore } from '@store/jam';

    export let key: PianoKeyNote;
    export let nthBlack: number;

    let keySpacing: number;

    switch (nthBlack) {
        case 1:
            keySpacing = 0;
            break;
        case 3:
            keySpacing = 1;
            break;
        case 6:
            keySpacing = 3;
            break;
        case 8:
            keySpacing = 4;
            break;
        case 10:
            keySpacing = 5;
            break;
    }

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
    style={`left: ${keySpacing * 2.2 + 1 + 2 * 0.2}rem;`}
    class="key"
    class:pressed={$JamPianoStore.currNote === key}>
    <p>{key.name[0]}</p>
</div>

<style lang="scss">
    .key {
        position: absolute;
        width: 1.5rem;
        height: 50%;
        padding: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        background-color: #000;
        transition: 0.3s ease;
        cursor: pointer;
        box-shadow: 0 0 0.5rem #000;

        p {
            color: #fff;
            font-size: 0.8rem;
        }
    }

    .key:hover {
        background-color: #333;
    }

    .pressed {
        box-shadow: none;
    }
</style>
