<script lang="ts">
    import { Envelope } from '@lib/envelope/envelope';
    import { genPianoKeys } from '@lib/services/jam/piano';
    import { NoteState, type MIDIMsg, type PianoKeyNote } from '@lib/types/jam';
    import { WSMsgTyp } from '@lib/types/websocket';
    import { JamStore } from '@store/jam';
    import { PianoStore } from '@store/piano';
    import { UserStore } from '@store/user';
    import { onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';
    import Select from '../global/Select.svelte';
    import PianoOctave from './PianoOctave.svelte';

    const sizes = [49, 61];
    let keyboardSize: 49 | 61 = 49;
    let keyboard: PianoKeyNote[][];

    function handleKeyUp() {
        $PianoStore = { keydown: false, currNote: null };
    }

    function playNote(midi: MIDIMsg) {
        const wsMsg = new Envelope($UserStore.userId, WSMsgTyp.MIDI, midi);
        $JamStore.ws.send(wsMsg.json());
    }

    const unsubscribe = PianoStore.subscribe((v) => {
        if (v.keydown && v.currNote) {
            playNote({
                state: NoteState.NOTE_ON,
                number: v.currNote.midi,
                velocity: 120,
            });

            console.log('played');
        }
    });

    $: keyboard = genPianoKeys(keyboardSize);

    onDestroy(() => {
        unsubscribe();
    });
</script>

<svelte:window on:mouseup={handleKeyUp} />

<div
    transition:fly={{ y: 200, duration: 300 }}
    class="piano">
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
                <PianoOctave keys={octave} />
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
