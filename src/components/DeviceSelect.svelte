<script lang="ts">
    import { JamStore, setAvailableDevices } from '@lib/jam';
    import { onMount } from 'svelte';
    import Select from './base/Select.svelte';

    export let selected: MediaDeviceInfo;

    async function listDevices() {
        if (!navigator.mediaDevices?.enumerateDevices) {
            console.warn('enumerateDevices() not supported.');
            return [];
        }

        // List cameras and microphones.
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter((d) => d.kind === 'audioinput');

        setAvailableDevices(audioDevices);
    }

    onMount(async () => {
        await listDevices();
    });
</script>

<Select
    label={'Device'}
    options={$JamStore.availableDevices}
    display={(d) => d.label || d.deviceId}
    bind:value={selected} />
