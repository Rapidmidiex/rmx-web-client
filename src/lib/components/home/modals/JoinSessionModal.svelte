<script lang="ts">
    import fuzzysort from 'fuzzysort';
    import Modal from '@lib/components/global/Modal.svelte';
    import type { GetJamData } from '@lib/types/jam';
    import Button from '@lib/components/global/Button.svelte';
    import TextInput from '@lib/components/global/TextInput.svelte';
    import { applyTheme, themeStore } from '@store/theme';
    import { Agent } from '@api/api';

    export let closeFunc: Function;

    let search = '';

    $: response = getJamRoomsResponse();

    async function getJamRoomsResponse() {
        const {
            data: { rooms },
        } = await Agent.Jams.list();
        return rooms;
    }

    function handleResults(rooms: GetJamData[], search = ''): GetJamData[] {
        if (search === '') return rooms; //.map((room) => ({ obj: room }));

        return fuzzysort
            .go<GetJamData>(search, rooms, {
                all: false,
                key: 'name',
            })
            .map((res) => res.obj);
    }

    let vars; //FIXME -- `applyTheme expects `Theme` but this is `any`
    $: vars = $themeStore.vars;
</script>

<Modal
    name="join"
    {closeFunc}>
    {#await response}
        <h2>Loading...</h2>
    {:then rooms}
        <div
            class="join-modal"
            style={applyTheme(vars)}>
            <div class="search-bar">
                <TextInput
                    bind:value={search}
                    placeholder="Search" />
            </div>
            <ul class="jams-list">
                {#if handleResults(rooms, search).length === 0}
                    <li class="jam">
                        <div class="info">
                            <div class="name">No rooms found</div>
                        </div>
                    </li>
                {:else}
                    {#each handleResults(rooms, search) as room}
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
    {:catch error}
        <div>{error}</div>
    {/await}
</Modal>

<!-- 
<Modal
    name="join"
    {closeFunc}>
    <div
        style={applyTheme(vars)}
        class="join-modal">
        <div class="search-bar">
            <TextInput
                bind:value={search}
                on:input={searchJams}
                placeholder="Search" />
        </div>
        <ul class="jams-list">
            {#if jams}
                {#if jams.length > 0}
                    {#if searchResult && searchResult.length > 0}
                        {#each searchResult as jam}
                            <li class="jam">
                                <div class="info">
                                    <div class="name">
                                        {jam.obj.name}
                                    </div>
                                </div>
                                <Button on:click={() => joinJam(jam.obj.id)}
                                    >Join</Button>
                            </li>
                        {/each}
                    {:else}
                        {#each jams as jam}
                            <li class="jam">
                                <div class="info">
                                    <div class="name">
                                        {jam.name ? jam.name : jam.id}
                                    </div>
                                </div>
                                <Button on:click={() => joinJam(jam.id)}
                                    >Join</Button>
                            </li>
                        {/each}
                    {/if}
                {:else}
                    <h2>No Jam room created yet</h2>
                {/if}
            {:else}
                <h2>{jamsProgress}</h2>
            {/if}
        </ul>
    </div>
</Modal> -->
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
