<script lang="ts">
    import { onMount } from 'svelte';
    import { JamStore, setAudioDevice, setAvailableDevices } from '@store/jam';
    import Select from '../global/Select.svelte';

    export let onSelect: (device: MediaDeviceInfo) => void;

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

    function handleChange() {
        setAudioDevice(selected);
        onSelect?.(selected);
    }

    let selected = $JamStore.audioInputDevice;

    onMount(async () => {
        await listDevices();
    });
</script>

<Select
    label={'Device'}
    options={$JamStore.availableDevices}
    display={(d) => d.label || d.deviceId}
    bind:value={selected}
    on:change={handleChange} />
