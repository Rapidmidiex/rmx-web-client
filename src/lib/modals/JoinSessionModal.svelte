<script lang="ts">
    import { api } from '../../api/api';
    import { onMount } from 'svelte';
    import Modal from '../components/Modal.svelte';
    import type { Room } from '../../models/room';

    export let closeFunc;

    let rooms: Room[] = [];

    function LoadRooms() {
        api.get('/jam').then(({ data }) => {
            rooms = data['rooms'];
        });
    }

    onMount(() => {
        LoadRooms();
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
        <ul class="room-list">
            {#each rooms as room}
                <li class="room">
                    <div class="info">
                        <div class="name">
                            {room.name ? room.name : room.roomId}
                        </div>
                    </div>
                    <button class="btn">Join</button>
                </li>
            {/each}
        </ul>
    </div>
</Modal>

<style lang="scss">
    .join-modal {
        width: 80vw;
        height: 80vh;
        background-color: #fff;
        border-radius: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        padding: 1rem;

        & > .search-bar {
            width: 100%;

            & > input {
                width: 100%;
            }
        }

        & > .room-list {
            width: 100%;
            padding: 1rem 0;
            list-style: none;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;

            & > .room {
                height: 10rem;
                padding: 0.5rem;
                box-shadow: 0px 0px 5px rgba($color: #000000, $alpha: 0.3);
                border-radius: 0.3rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-direction: column;

                & > .info {
                    width: 100%;
                }

                & > button {
                    width: 100%;
                    padding: 1rem;
                }
            }
        }
    }
</style>
