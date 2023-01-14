<script lang="ts">
    import { api } from '../../api/api';
    import Modal from '../components/Modal.svelte';

    export let closeFunc;

    let name: string = "";
    let bpm: number;
    function CreateSession() {
        api.post('/jam')
            .then(() => {
                alert('Jam created. redirecting...');
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
            bind:value={bpm}
            class="inpt"
            type="number"
            name="bpm"
            id="bpm"
            placeholder="BPM (default: 80)" />
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

        & > input {
            width: 100%;
            margin: 1rem 0;
        }

        & > button {
            padding: 1rem;
            width: 100%;
        }
    }
</style>
