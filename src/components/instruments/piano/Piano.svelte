<script lang="ts">
    import Button from '@components/base/Button.svelte';
    import Icon from '@components/base/Icon.svelte';
    import {
        PianoStore,
        smallKeyboard,
        mediumKeyboard,
        type PianoKeyNote,
    } from '@lib/audio/piano';
    import { jamStore } from '@lib/jam';
    import type { Message } from '@lib/message';
    import { pingStats } from '@lib/ping';
    import { UserStore } from '@lib/user';
    import { onDestroy, onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { v4 as uuid } from 'uuid';
    import Select from '../../base/Select.svelte';
    import PianoOctave from './PianoOctave.svelte';

    // map available octaves
    let octaveNums: number[] = [];
    $: octaveNums = Array.from(
        {
            length: Math.ceil($PianoStore.size.length / 12),
        },
        (_, i) => i + 1
    );

    let octaveLength = 12;
    $: octaveLength = $PianoStore.octaveNotes.length;

    let octaveThres = 0;
    $: octaveThres = ($PianoStore.currOctave - 1) * 12;

    let keys: PianoKeyNote[] = [];
    $: keys = $PianoStore.octaveNotes.map((item) => ({
        ...item,
        midi: octaveThres + item.midi,
    }));

    const keyMap = new Map([
        ['KeyA', 0],
        ['KeyW', 1],
        ['KeyS', 2],
        ['KeyD', 3],
        ['KeyR', 4],
        ['KeyF', 5],
        ['KeyT', 6],
        ['KeyG', 7],
        ['KeyH', 8],
        ['KeyU', 9],
        ['KeyJ', 10],
        ['KeyI', 11],
    ]);

    function nextOctave() {
        if ($PianoStore.currOctave === octaveNums[octaveNums.length - 1]) {
            $PianoStore.currOctave = octaveNums[0];
        } else {
            $PianoStore.currOctave = octaveNums[$PianoStore.currOctave];
        }
        // the last octave may not be a full octave
        // so we just remove the remaining notes
        if ($PianoStore.currOctave * 12 > $PianoStore.size.length) {
            // decrease the octave length by the difference between
            // the keyboard size and keyboard with full last octave
            octaveLength -=
                $PianoStore.currOctave * 12 - $PianoStore.size.length;
        }
    }

    function prevOctave() {
        if ($PianoStore.currOctave === octaveNums[0]) {
            $PianoStore.currOctave = octaveNums[octaveNums.length - 1];
        } else {
            $PianoStore.currOctave = octaveNums[$PianoStore.currOctave - 2];
        }
    }

    function shiftOctaveNotes() {
        for (
            let i = 0;
            i <
            $PianoStore.size.startingNote.midi -
                $PianoStore.octaveNotes[0].midi;
            i++
        ) {
            let note = $PianoStore.octaveNotes.shift();
            note.midi =
                $PianoStore.octaveNotes[$PianoStore.octaveNotes.length - 1]
                    .midi + 1;
            $PianoStore.octaveNotes.push(note);
        }
    }

    function handleKeyUp() {
        $PianoStore.keydown = false;
        $PianoStore.currNote = null;
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (!keyMap.has(e.code)) return;
        const key = keyMap.get(e.code);
        const message: Message = {
            id: uuid(),
            type: 'midi',
            payload: {
                state: 1,
                number: octaveThres + $PianoStore.octaveNotes[key].midi,
                velocity: 120,
            },
            userId: $UserStore.userId,
        };

        pingStats.msgOut(message.id);
        $jamStore.ws.send(JSON.stringify(message));
    }

    const unsubscribe = PianoStore.subscribe((v) => {
        if (v.keydown && v.currNote) {
            // TODO -- clean this up with a better API
            // at least its a bit more consistent
            // due to pingStags, needing an ID
            // I can't use the `MessageParser, so will need to revise that
            {
                let message = {
                    id: uuid(),
                    type: 'midi',
                    payload: {
                        state: 1,
                        number: v.currNote.midi,
                        velocity: 120,
                    },
                    userId: $UserStore.userId,
                } satisfies Message;

                pingStats.msgOut(message.id);
                $jamStore.ws.send(JSON.stringify(message));
            }
        }
    });

    onMount(shiftOctaveNotes);
    onDestroy(() => unsubscribe());
</script>

<svelte:window
    on:mouseup={handleKeyUp}
    on:keydown={handleKeyDown} />

<div
    transition:fly={{ y: 200, duration: 300 }}
    class="piano">
    <div class="controls">
        <Select
            label="Size:"
            options={[smallKeyboard, mediumKeyboard]}
            display={(o) => o.length}
            bind:value={$PianoStore.size} />
        <Button on:click={prevOctave}><Icon name="chevron-left" /></Button>
        <Button on:click={nextOctave}><Icon name="chevron-right" /></Button>
    </div>
    <div class="wrapper">
        <div class="con">
            <PianoOctave {keys} />
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
