<script lang="ts">
    import { api } from '../../api/api';
    import { onMount } from 'svelte';
    import Modal from '../components/Modal.svelte';
    import type { GetJamData } from '../../models/jam';
    import type { AxiosError } from 'axios';
    import { navigate } from 'svelte-navigator';
    import { JamStore } from '../../store/jam';
    import { Failure } from '../notify/notify';

    export let closeFunc: Function;
    let jams: GetJamData[];

    function joinJam(id: string) {
        const jam = jams.find(jam => jam.id === id)
        JamStore.set({
            id: jam.id,
            name: jam.name,
            bpm: jam.bpm,
            users: [],
        })

        navigate("/jam", {replace: true})
    }

    function loadJams() {
        api.get<{rooms: GetJamData[]}>('/jam').then(({ data }) => {
            jams = data.rooms;
        })
        .catch((error: AxiosError) => {
            Failure(error.message)
        })
    }

    onMount(() => {
        loadJams();
    });
</script>

<Modal {closeFunc}>
    <div class="join-modal">
        <div class="search-bar">
            <input
                class="inpt"
                type="text"
                name="search"
                id="search"
                placeholder="Search" />
        </div>
        <ul class="jams-list">
            {#if jams}
                {#each jams as jam}
                    <li class="jam">
                        <div class="info">
                            <div class="name">
                                {jam.name ? jam.name : jam.id}
                            </div>
                        </div>
                        <button class="btn" on:click={() => joinJam(jam.id)}>Join</button>
                    </li>
                {/each}
            {:else}
                <h2>Couldn't load Jams list</h2>
            {/if}
            
        </ul>
    </div>
</Modal>

<style lang="scss">
    .join-modal {
        width: 30rem;
        height: 80vh;
        background-color: #fff;
        border-radius: 0.3rem;
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
                border-radius: 0.3rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-direction: column;
                word-wrap: break-word;

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
