<script lang="ts">
    import {
        genPianoKeys,
        keyBindings,
        PianoStore,
        type PianoKeyNote,
    } from '@lib/audio/piano';
    import { jamStore } from '@lib/jam';
    import type { Message } from '@lib/message';
    import { pingStats } from '@lib/ping';
    import { UserStore } from '@lib/user';
    import { onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';
    import { v4 as uuid } from 'uuid';
    import Select from '../../base/Select.svelte';
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
            const message: Message = {
                id: uuid(),
                type: 'midi',
                payload: {
                    state: 1,
                    number: midi,
                    velocity: 120,
                },
                userId: $UserStore.userId,
            };

            pingStats.msgOut(message.id);
            $jamStore.ws.send(JSON.stringify(message));
        };
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

    // TODO: Fix this double call of genPianoKeys.
    // The destructuring breaks the piano size setting
    const { keyMap } = genPianoKeys(keyboardSize, keyBindings);
    $: keyboard = genPianoKeys(keyboardSize, keyBindings).keyboard;

    onDestroy(() => unsubscribe());
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
