<script lang="ts">
    import Modal from '@components/base/Modal.svelte';
    import Button from '@components/base/Button.svelte';
    import TextInput from '@components/base/TextInput.svelte';
    import { applyTheme, themeStore } from '@store/theme';
    import { agent } from '@lib/api';
    import {
        fetchState,
        getFilteredJams,
        getJamRooms,
    } from '@store/getJamRooms';
    import { onMount } from 'svelte';

    onMount(() => {
        getJamRooms().then((value) => {
            rooms = value;
        });
    });

    let themeVars; //FIXME -- `applyTheme expects `Theme` but this is `any`
    $: themeVars = $themeStore.vars;

    let searchQuery = '';
    $: rooms = getFilteredJams(searchQuery);
</script>

<Modal
    name="join"
    on:close>
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
                            <Button on:click={() => agent.redirect.jam(room.id)}
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
