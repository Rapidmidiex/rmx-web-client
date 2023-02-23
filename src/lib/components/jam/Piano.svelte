<script lang="ts">
    import type { Message, MessagePayload } from '@lib/envelope/message';
    import { genPianoKeys } from '@lib/services/jam/piano';
    import { NoteState, type PianoKeyNote } from '@lib/types/jam';
    import { JamStore } from '@store/jam';
    import { PianoStore } from '@store/piano';
    import { pingStats } from '@store/ping';
    import { UserStore } from '@store/user';
    import { onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';
    import { v4 as uuid } from 'uuid';
    import Select from '../global/Select.svelte';
    import PianoOctave from './PianoOctave.svelte';

    const sizes = [49, 61];
    let keyboardSize: 49 | 61 = 49;
    let keyboard: PianoKeyNote[][];

    function handleKeyUp() {
        $PianoStore = { keydown: false, currNote: null };
    }

    function sendMsg(midi: MessagePayload['midi']) {
        let message = {
            id: uuid(),
            type: 'midi',
            payload: midi,
            userId: $UserStore.userId,
        } satisfies Message;

        pingStats.msgOut(message.id);
        $JamStore.ws.send(JSON.stringify(message));
    }

    const unsubscribe = PianoStore.subscribe((v) => {
        if (v.keydown && v.currNote) {
            sendMsg({
                state: NoteState.NOTE_ON,
                number: v.currNote.midi,
                velocity: 120,
            });
        }
    });

    $: keyboard = genPianoKeys(keyboardSize);

    onDestroy(() => unsubscribe());
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
