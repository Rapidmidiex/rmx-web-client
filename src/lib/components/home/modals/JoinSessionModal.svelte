<script lang="ts">
    import type { AxiosError } from 'axios';
    import fuzzysort from 'fuzzysort';
    import { api } from '@api/api';
    import Modal from '@lib/components/global/Modal.svelte';
    import { Failure } from '@lib/notify/notify';
    import type { GetJamData } from '@lib/types/jam';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-navigator';

    export let closeFunc: Function;
    let jams: GetJamData[];
    let searchResult: Fuzzysort.KeyResults<GetJamData>;
    let jamsProgress: string = 'Loading...';
    let search: string;

    function joinJam(id: string) {
        navigate(`/jam/${id}`, { replace: true });
    }

    function loadJams() {
        return api
            .get<{ rooms: GetJamData[] }>('/jam')
            .then(({ data }) => {
                jams = data.rooms;
            })
            .catch((error: AxiosError) => {
                Failure(error.message);
                jamsProgress = "Couldn't load Jams list";
            });
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
</script>

<Modal {closeFunc}>
    <div class="join-modal">
        <div class="search-bar">
            <input
                class="inpt"
                type="text"
                bind:value={search}
                on:input={searchJams}
                name="search"
                id="search"
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
                                <button
                                    class="btn"
                                    on:click={() => joinJam(jam.obj.id)}
                                    >Join</button>
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
                                <button
                                    class="btn"
                                    on:click={() => joinJam(jam.id)}
                                    >Join</button>
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
        background-color: #fff;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        overflow: hidden;

        & > .search-bar {
            width: 100%;
            padding: 1rem 1rem 0;

            & > input {
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
            padding: 1rem;

            & > .jam {
                width: 100%;
                height: 10rem;
                margin: 0.5rem 0;
                padding: 0.5rem;
                box-shadow: 0px 0px 5px rgba($color: #000000, $alpha: 0.3);
                border-radius: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-direction: column;
                word-break: break-all;

                & > .info {
                    width: 100%;
                    word-break: break-all;
                }

                & > button {
                    width: 100%;
                    padding: 1rem;
                }
            }
        }
    }
</style>
