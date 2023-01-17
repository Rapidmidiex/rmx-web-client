<script lang="ts">
    import type { CreateJamData } from '../../../models/jam';
    import Modal from '../../../lib/components/Modal.svelte';
    import type { AxiosError } from 'axios';
    import { api } from '../../../api/api';
    import { Failure, Success } from '../../../lib/notify/notify';

    export let closeFunc: Function;

    let name: string;
    let capacity: number;
    let bpm: number;
    function CreateSession() {
        const payload: CreateJamData = {
            name,
            capacity,
            bpm
        }

        api.post('/jam', JSON.stringify(payload))
            .then(() => {
                Success("new Jam room created. redirecting...")
            })
            .catch((error: AxiosError) => {
                Failure(error.message)
            })
            .finally(() => {
                closeFunc();
            });
    }
</script>

<Modal {closeFunc}>
    <form class="new_session-form" on:submit|preventDefault={CreateSession}>
        <h3>Start a new Jam</h3>
        <input
            bind:value={name}
            class="inpt"
            type="text"
            name="name"
            id="name"
            placeholder="Room name (optional)" />
        <input
            bind:value={capacity}
            class="inpt"
            type="number"
            name="capacity"
            id="capacity"
            placeholder="Room capacity (default: 10)" />
        <input
            bind:value={bpm}
            class="inpt"
            type="number"
            name="bpm"
            id="bpm"
            placeholder="BPM (default: 120)" />
        <button class="btn" type="submit">Start</button>
    </form>
</Modal>

<style lang="scss">
    form {
        width: 25rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        flex-direction: column;

        & > h3 {
            margin: 1rem 0;
        }

        & > input {
            width: 100%;
            margin: 0.5rem 0;
        }

        & > button {
            margin: 1rem 0 0rem 0;
            padding: 1rem;
            width: 100%;
        }
    }
</style>
