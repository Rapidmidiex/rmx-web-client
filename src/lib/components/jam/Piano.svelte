<script lang="ts">
    import { genPianoKeys, keyBindings } from '@lib/services/jam/piano';
    import { NoteState, type MIDIMsg, type PianoKeyNote } from '@lib/types/jam';
    import { WSMsgTyp, type WSMsg } from '@lib/types/websocket';
    import { JamStore } from '@store/jam';
    import { PianoStore } from '@store/piano';
    import { pingStats } from '@store/ping';
    import { UserStore } from '@store/user';
    import { onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';
    import { v4 as uuidv4 } from 'uuid';
    import Select from '../global/Select.svelte';
    import PianoOctave from './PianoOctave.svelte';

    const sizes = [49, 61];
    let keyboardSize: 49 | 61 = 49;
    let keyboard: PianoKeyNote[][];

    function handleKeyUp() {
        $PianoStore = { keydown: false, currNote: null };
    }

    function handleKeyDown(keyMap: Record<string, number>) {
        return (e: KeyboardEvent) => {
            const midi = keyMap[e.key];
            if (!midi) return;

            sendMsg({
                state: NoteState.NOTE_ON,
                number: midi,
                velocity: 120,
            });
        };
    }

    function sendMsg(midi: MIDIMsg) {
        let msg: WSMsg<MIDIMsg> = {
            id: uuidv4(),
            type: WSMsgTyp.MIDI,
            payload: midi,
            userId: $UserStore.userId,
        };

        pingStats.msgOut(msg.id);
        $JamStore.ws.send(JSON.stringify(msg));
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

    // TODO: Fix this double call of genPianoKeys.
    // The destructuring breaks the piano size setting
    const { keyMap } = genPianoKeys(keyboardSize, keyBindings);
    $: keyboard = genPianoKeys(keyboardSize, keyBindings).keyboard;

    onDestroy(() => {
        unsubscribe();
    });
</script>

<svelte:window
    on:mouseup={handleKeyUp}
    on:keydown={handleKeyDown(keyMap)} />

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
