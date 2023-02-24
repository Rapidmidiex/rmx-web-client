<script lang="ts">
    import fuzzysort from 'fuzzysort';
    import { api } from '@api/api';
    import Modal from '@lib/components/global/Modal.svelte';
    import { Failure } from '@lib/notify/notify';
    import type { GetJamData } from '@lib/types/jam';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-navigator';
    import Button from '@lib/components/global/Button.svelte';
    import TextInput from '@lib/components/global/TextInput.svelte';
    import { applyTheme, themeStore } from '@store/theme';

    export let closeFunc: Function;
    let jams: GetJamData[];
    let searchResult: Fuzzysort.KeyResults<GetJamData>;
    let jamsProgress: string = 'Loading...';
    let search: string;

    function joinJam(id: string) {
        navigate(`/jam/${id}`, { replace: true });
    }

    async function loadJams() {
        try {
            // /api/v1/jam
            const { data } = await api.get<{ rooms: GetJamData[] }>('/api/v1/jam');
            jams = data.rooms;
        } catch (error) {
            Failure(error.message);
            jamsProgress = "Couldn't load Jams list";
        }
    }

    function searchJams() {
        searchResult = fuzzysort.go<GetJamData>(search, jams, {
            all: false,
            key: 'name',
        });
    }

    onMount(async () => {
        await loadJams();
    });

    let vars;
    $: vars = $themeStore.vars;
</script>

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
