<script lang="ts">
    import Button from '@components/base/Button.svelte';
    import Icon from '@components/base/Icon.svelte';
    import {
        KeyboardStore,
        keyboardLayouts,
        keyMap,
        type KeyNote,
        generateNotes,
    } from '@lib/audio/keyboard';
    import { jamStore } from '@lib/jam';
    import type { Message } from '@lib/message';
    import { pingStats } from '@lib/ping';
    import { UserStore } from '@lib/user';
    import { onDestroy, onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { v4 as uuid } from 'uuid';
    import Select from '../../base/Select.svelte';
    import KeyboardKey from './KeyboardKey.svelte';

    let notes: KeyNote[] = generateNotes($KeyboardStore.layout);

    function changeLayout() {
        notes = generateNotes($KeyboardStore.layout);
        shiftNotes(0);
    }

    function shiftNotes(thres: number) {
        const map = notes.map((k) => k.midi);
        const startIdx = map.indexOf($KeyboardStore.currNotes[0].midi);
        const endIdx = map.indexOf(
            $KeyboardStore.currNotes[$KeyboardStore.currNotes.length - 1].midi
        );

        // don't allow out of boundaries
        if (startIdx + thres < 0 || endIdx + thres > notes.length - 1) return;

        $KeyboardStore.currNotes = notes.slice(
            startIdx + thres,
            endIdx + thres + 1 // +1 because slice method returns everything before ending index
        );
    }

    function handleKeyUp() {
        $KeyboardStore.keydown = false;
        $KeyboardStore.currNote = null;
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (!keyMap.has(e.code)) return;
        const key = keyMap.get(e.code);
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

    $: topRowKeys = $KeyboardStore.currNotes.filter(
        (note) => note.note.black === true
    );
    $: bottomRowKeys = $KeyboardStore.currNotes.filter(
        (note) => note.note.black === false
    );
</script>

<svelte:window
    on:mouseup={handleKeyUp}
    on:keydown={handleKeyDown} />

<div
    transition:fly={{ y: 200, duration: 300 }}
    class="keyboard">
    <div class="controls">
        <Select
            label="Size:"
            options={keyboardLayouts}
            display={(o) => o.length}
            on:change={changeLayout}
            value={$KeyboardStore.layout} />
        <Button on:click={() => shiftNotes(-1)}
            ><Icon name="chevron-left" /></Button>
        <Button on:click={() => shiftNotes(1)}
            ><Icon name="chevron-right" /></Button>
    </div>
    <div class="wrapper">
        <div class="row">
            {#each topRowKeys as key, idx}
                <KeyboardKey
                    {key}
                    label={topRowNames[idx]} />
            {/each}
        </div>
        <div class="row">
            {#each bottomRowKeys as key, idx}
                <KeyboardKey
                    {key}
                    label={bottomRowNames[idx]} />
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
