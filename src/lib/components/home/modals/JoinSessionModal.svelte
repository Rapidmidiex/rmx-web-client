<script lang="ts">
    import Modal from '@lib/components/global/Modal.svelte';
    import Button from '@lib/components/global/Button.svelte';
    import TextInput from '@lib/components/global/TextInput.svelte';
    import { applyTheme, themeStore } from '@store/theme';
    import { Agent } from '@api/api';
    import { fetchState, fuzzySearch, getJamRooms } from './getJamRooms';
    import { onDestroy, onMount } from 'svelte';

    export let closeFunc: Function;

    onMount(() => {
        getJamRooms().then((value) => {
            rooms = value;
        });
    });

    let themeVars; //FIXME -- `applyTheme expects `Theme` but this is `any`
    $: themeVars = $themeStore.vars;

    let searchQuery = '';
    $: rooms = fuzzySearch(searchQuery);

    onDestroy(() => {
        searchQuery = '';
    });
</script>

<Modal
    name="join"
    {closeFunc}>
    {#if $fetchState === 'loading'}
        <h2>Loading...</h2>
    {:else}
        <div
            class="join-modal"
            style={applyTheme(themeVars)}>
            <div class="search-bar">
                <TextInput
                    bind:value={searchQuery}
                    placeholder="Search" />
            </div>
            <ul class="jams-list">
                {#if rooms.length === 0}
                    <li class="jam">
                        <div class="info">
                            <div class="name">No rooms found</div>
                        </div>
                    </li>
                {:else}
                    {#each rooms as room}
                        <li class="jam">
                            <div class="info">
                                <div class="name">
                                    {room.name}
                                </div>
                            </div>
                            <Button on:click={() => Agent.Redirect.jam(room.id)}
                                >Join</Button>
                        </li>
                    {/each}
                {/if}
            </ul>
        </div>
    {/if}
</Modal>

<style lang="scss">
    .join-modal {
        width: 30rem;
        height: 80vh;
        background-color: var(--background);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        overflow: hidden;

        & > .search-bar {
            width: 100%;
            padding: 0 0 1rem 0;

            :global(input) {
                width: 100%;
            }
        }

        & > .jams-list {
            width: 100%;
            list-style: none;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            overflow-y: auto;

            & > .jam {
                width: 100%;
                height: 10rem;
                margin: 0.5rem 0;
                padding: 0.5rem;
                background-color: var(--background-accent);
                border-radius: var(--border-radius);
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-direction: column;
                word-break: break-all;

                & > .info {
                    width: 100%;
                    word-break: break-all;
                }

                :global(button) {
                    width: 100%;
                }
            }
        }
    }
</style>
