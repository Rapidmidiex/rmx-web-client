<script lang="ts">
    import Button from "@components/base/Button.svelte";
    import Icon from "@components/base/Icon.svelte";
    import Modal from "@components/base/Modal.svelte";
</script>

<Modal
    name="settings"
    on:close
    ><div class="settings">
        <div class="categories">
            <Button type="button"
                ><Icon name="speaker" />
                <p>Playback</p></Button>
            <Button type="button"
                ><Icon name="layout" />
                <p>Playback</p></Button>
        </div>
        <div class="content" />
    </div>
</Modal>

<style lang="scss">
    .settings {
        width: 25rem;
        display: flex;

        .categories {
            width: 100%;
            height: 100%;
            display: flex;

            :global(button) {
                width: 100%;
            }
        }
    }
</style>
