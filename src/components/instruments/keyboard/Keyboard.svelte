<script lang="ts">
    import Button from '@components/base/Button.svelte';
    import Icon from '@components/base/Icon.svelte';
    import {
        KeyboardStore,
        keyMap,
        type KeyNote,
        generateNotes,
    } from '@lib/audio/keyboard';
    import { jamStore } from '@lib/jam';
    import type { Message } from '@lib/message';
    import { pingStats } from '@lib/ping';
    import { settingsStore } from '@lib/settings';
    import { UserStore } from '@lib/user';
    import { onDestroy, onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { v4 as uuid } from 'uuid';
    import KeyboardKey from './KeyboardKey.svelte';

    let notes: KeyNote[] = generateNotes($KeyboardStore.layout);
    let reversedNotes: KeyNote[];
    $: reversedNotes = notes.slice().reverse();

    function shiftOctave(thres: -1 | 1) {
        const map = notes.map((n) => n.midi);

        let startIdx = map.indexOf($KeyboardStore.currNotes[0].midi);
        let endIdx = map.indexOf(
            $KeyboardStore.currNotes[$KeyboardStore.currNotes.length - 1].midi
        );

        // don't allow out of boundaries
        if (startIdx + thres * 12 < 0) {
            startIdx = 0;
            endIdx = keyMap.size - 1;
        } else if (endIdx + thres * 12 > notes.length - 1) {
            startIdx = map.indexOf(
                reversedNotes.find(
                    (n) =>
                        n.note.name[0] ===
                        $KeyboardStore.layout.firstOctave[0].note.name[0]
                ).midi
            );

            endIdx = notes.length - 1;
        } else {
            endIdx = startIdx + keyMap.size - 1 + thres * 12;
            startIdx =
                map.indexOf($KeyboardStore.currNotes[0].midi) + thres * 12;
        }

        console.log(startIdx, endIdx);

        $KeyboardStore.currNotes = notes.slice(
            startIdx,
            endIdx + 1 // +1 because slice method returns everything before ending index
        );
    }

    function handleKeyUp() {
        $KeyboardStore.keydown = false;
        $KeyboardStore.currNote = null;
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.code === $settingsStore.keyBindings.octaveSwitch[0]) {
            shiftOctave(-1);
            return;
        }
        if (e.code === $settingsStore.keyBindings.octaveSwitch[1]) {
            shiftOctave(1);
            return;
        }
        if (!keyMap.has(e.code)) return;
        const key = keyMap.get(e.code);
        if ($KeyboardStore.currNotes[key] === undefined) return;
        const message: Message = {
            id: uuid(),
            type: 'midi',
            payload: {
                state: 1,
                number: $KeyboardStore.currNotes[key].midi,
                velocity: 120,
            },
            userId: $UserStore.userId,
        };

        pingStats.msgOut(message.id);
        $jamStore.ws.send(JSON.stringify(message));
    }

    const unsubscribe = KeyboardStore.subscribe((v) => {
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

    onMount(() => {
        $KeyboardStore.currNotes = notes.slice(0, 18);
    });
    onDestroy(() => unsubscribe());

    const topRowNames = 'WETYUOP';
    const bottomRowNames = "ASDFGHJKL;'";

    $: topRowKeys = $KeyboardStore.currNotes
        .filter((note) => note.note.black === true)
        .map((note, idx) => ({ note: note, binding: topRowNames[idx] }));
    $: bottomRowKeys = $KeyboardStore.currNotes
        .filter((note) => note.note.black === false)
        .map((note, idx) => ({ note: note, binding: bottomRowNames[idx] }));
</script>

<svelte:window
    on:mouseup={handleKeyUp}
    on:keydown={handleKeyDown} />

<div
    transition:fly={{ y: 200, duration: 300 }}
    class="keyboard">
    <div class="controls">
        <Button on:click={() => shiftOctave(-1)}
            ><Icon name="chevron-left" /></Button>
        <Button on:click={() => shiftOctave(1)}
            ><Icon name="chevron-right" /></Button>
    </div>
    <div class="wrapper">
        <div class="row">
            {#each topRowKeys as key, idx}
                <KeyboardKey {key} />
            {/each}
        </div>
        <div class="row">
            {#each bottomRowKeys as key, idx}
                <KeyboardKey {key} />
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .keyboard {
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
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            .row {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
        }
    }
</style>
