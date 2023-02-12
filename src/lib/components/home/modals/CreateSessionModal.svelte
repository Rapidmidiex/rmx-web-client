<script lang="ts">
    import type { AxiosError } from 'axios';
    import { api } from '@api/api';
    import Modal from '@lib/components/global/Modal.svelte';
    import { Failure, Success } from '@lib/notify/notify';
    import type { CreateJamData, GetJamData } from '@lib/types/jam';
    import { navigate } from 'svelte-navigator';
    import Button from '@lib/components/global/Button.svelte';
    import TextInput from '@lib/components/global/TextInput.svelte';
    import NumberInput from '@lib/components/global/NumberInput.svelte';

    export let closeFunc: Function;

    let name: string;
    let capacity: number;
    let bpm: number;
    function CreateSession() {
        const payload: CreateJamData = {
            name,
            capacity,
            bpm,
        };

        api.post<GetJamData>('/jam', JSON.stringify(payload))
            .then(({ data }) => {
                Success('new Jam room created. redirecting...');
                navigate(`/jam/${data.id}`, { replace: true });
            })
            .catch((error: AxiosError) => {
                Failure(error.message);
            })
            .finally(() => {
                closeFunc();
            });
    }
</script>

<Modal {closeFunc}>
    <form
        class="new_session-form"
        on:submit|preventDefault={CreateSession}>
        <h3>Start a new Jam</h3>
        <TextInput
            bind:value={name}
            placeholder="Room name (optional)" />
        <NumberInput
            bind:value={capacity}
            placeholder="Room capacity (default: 10)" />
        <NumberInput
            bind:value={bpm}
            placeholder="BPM (default: 120)" />
        <Button type="submit">Start</Button>
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

        :global(input) {
            width: 100%;
            margin: 0.5rem 0;
        }

        :global(button) {
            margin: 1rem 0 0rem 0;
            width: 100%;
        }
    }
</style>
