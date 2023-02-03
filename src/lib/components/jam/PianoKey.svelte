<script lang="ts">
    import type { RmxEvent } from '@lib/consts/events';
    import { AS, CS, DS, FS, GS } from '@lib/consts/piano';
    import { NoteState, type MIDIMsg, type PianoKeyNote } from '@lib/types/jam';
    import { JamPianoStore } from '@store/jam';
    import { createEventDispatcher } from 'svelte/internal';

    export let key: PianoKeyNote;
    export let black: boolean;

    const svelteDispatch = createEventDispatcher();
    // Wrapping for type safety
    const dispatch = (name: RmxEvent, detail: MIDIMsg) => {
        svelteDispatch(name, detail);
    };

    let keySpacing: number; // spacing for black keys only
    switch (key.note) {
        case CS:
            keySpacing = 0;
            break;
        case DS:
            keySpacing = 1;
            break;
        case FS:
            keySpacing = 3;
            break;
        case GS:
            keySpacing = 4;
            break;
        case AS:
            keySpacing = 5;
            break;
    }

    function handleKeyDown() {
        const msg: MIDIMsg = {
            state: NoteState.NOTE_ON,
            number: key.midi,
            velocity: 127,
        };

        dispatch('INSTRUMENT_NOTE', msg);

        JamPianoStore.set({ keydown: true, currNote: key });
    }

    function handleKeyEnter() {
        if (!$JamPianoStore.keydown) {
            return;
        }

        JamPianoStore.update((v) => {
            return {
                ...v,
                currNote: key,
            };
        });
    }

    function handleKeyUp() {
        JamPianoStore.set({ keydown: false, currNote: null });
    }
</script>

<svelte:window on:mouseup={handleKeyUp} />

<div
    on:mousedown={handleKeyDown}
    on:mouseenter={handleKeyEnter}
    on:mouseup={handleKeyUp}
    on:focus
    style={black ? `left: ${keySpacing * 2.2 + 1 + 2 * 0.2}rem;` : ''}
    class="key"
    class:black
    class:pressed={$JamPianoStore.currNote === key}>
    <p>{key.note.name[0]}</p>
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
        box-shadow: 0 0.3rem 0.3rem #555;
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
        position: absolute;
        width: 1.5rem;
        height: 60%;
        margin: none;
        background-color: #000;

        p {
            color: #fff;
            font-size: 0.8rem;
        }
    }

    .black:hover {
        background-color: #333;
    }

    .pressed {
        box-shadow: none;
    }
</style>
