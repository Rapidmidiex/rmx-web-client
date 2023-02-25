<script lang="ts">
    import { agent } from '@lib/api';
    import Modal from '@components/base/Modal.svelte';
    import { Failure, Success } from '@lib/notify/notify';
    import Button from '@components/base/Button.svelte';
    import TextInput from '@components/base/TextInput.svelte';
    import NumberInput from '@components/base/NumberInput.svelte';

    // bounded values
    let name: string;
    let capacity: number;
    let bpm: number;

    async function createSession() {
        try {
            const { data } = await agent.jams.create({ name, capacity, bpm });
            Success('new Jam room created. redirecting...');
            agent.redirect.jam(data.id);
        } catch (error) {
            Failure(error.message);
        }
    }
</script>

<Modal
    name="new jam"
    on:close>
    <form
        class="new_session-form"
        on:submit|preventDefault={createSession}>
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
        display: flex;
        align-items: center;
        flex-direction: column;

        :global(input) {
            width: 100%;
            margin: 0.5rem 0;
        }

        :global(button) {
            margin: 1rem 0 0rem 0;
            width: 100%;
        }

        @media screen and (max-width: 35rem) {
            width: 100%;
            height: 100%;
        }
    }
</style>
