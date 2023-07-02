<script lang="ts">
    import {
        generateNotes,
        KeyboardStore,
        keyMap,
        type KeyNote,
    } from '@lib/audio/keyboard';
    import { settingsStore } from '@lib/settings';
    import { UserStore } from '@lib/user';
    import Keyboard from './keyboard/Keyboard.svelte';
    import Piano from './piano/Piano.svelte';
    import { v4 as uuid } from 'uuid';
    import { pingStats } from '@lib/ping';
    import { jamStore } from '@lib/jam';
    import type { Message } from '@lib/message';
    import { onDestroy, onMount } from 'svelte';
    import Button from '@components/base/Button.svelte';
    import { fly } from 'svelte/transition';
    import Icon from '@components/base/Icon.svelte';
    import { Icons } from '@assets/icons';

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
        if (e.key === $settingsStore.keyBindings.octaveSwitch[0]) {
            shiftOctave(-1);
            return;
        }
        if (e.key === $settingsStore.keyBindings.octaveSwitch[1]) {
            shiftOctave(1);
            return;
        }
        if (!keyMap.has(e.key)) return;
        const key = keyMap.get(e.key);
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
</script>

<svelte:window
    on:mouseup={handleKeyUp}
    on:keydown|preventDefault={handleKeyDown} />

<div
    transition:fly={{ y: 200, duration: 300 }}
    class="instrument">
    <div class="controls">
        <Button on:click={() => shiftOctave(-1)}
            ><Icon
                src={Icons.ChevronLeft}
                size="small" /></Button>
        <Button on:click={() => shiftOctave(1)}
            ><Icon
                src={Icons.ChevronRight}
                size="small" /></Button>
    </div>
    {#if $settingsStore.instrumentDisplay === 'Piano'}
        <Piano notes={$KeyboardStore.currNotes} />
    {:else if $settingsStore.instrumentDisplay === 'Keyboard'}
        <Keyboard notes={$KeyboardStore.currNotes} />
    {/if}
</div>

<style lang="scss">
    .instrument {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        user-select: none;

        .controls {
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
    }
</style>
