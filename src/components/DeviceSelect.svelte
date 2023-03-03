<script lang="ts">
    import { jamStore } from "@lib/jam";
    import { onMount } from "svelte";
    import Select from "./base/Select.svelte";

    export let selected: MediaDeviceInfo;

    onMount(async () => {
        if (!navigator.mediaDevices?.enumerateDevices) {
            console.warn("enumerateDevices() not supported.");
            return [];
        }

        // List cameras and microphones.
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(
            (device) => device.kind === "audioinput"
        );

        jamStore.setAudioDevices(audioDevices);
    });
</script>

<Select
    label={"Device"}
    options={$jamStore.availableDevices}
    display={(device) => device.label || device.deviceId}
    bind:value={selected} />
