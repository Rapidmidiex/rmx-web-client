<script lang="ts">
    import Button from '@lib/components/global/Button.svelte';
    import Icon from '@lib/components/global/Icon.svelte';
    import Modal from '@lib/components/global/Modal.svelte';

    export let closeFunc: Function;
</script>

<Modal {closeFunc}
    ><div class="settings">
        <div class="categories">
            <Button
                class="btn"
                type="button"
                ><Icon name="speaker" />
                <p>Playback</p></Button>
            <Button
                class="btn"
                type="button"
                ><Icon name="layout" />
                <p>Playback</p></Button>
        </div>
        <div class="content" />
    </div>
</Modal>

<style lang="scss">
    .settings {
        width: 25rem;
        padding: 1rem;
        display: flex;

        .categories {
            width: 8rem;
            height: 100%;
            display: flex;

            :global(.btn) {
                width: 100%;
            }
        }
    }
</style>
