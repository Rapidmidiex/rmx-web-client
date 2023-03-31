<script lang="ts">
    import ActionButton from '@components/base/ActionButton.svelte';
    import Icon from '@components/base/Icon.svelte';
    import Modal from '@components/base/Modal.svelte';
    import { settingsStore } from '@lib/settings';
    import { settingsPages } from '@lib/settings/settings';
    import KeyboardSettings from './KeyboardSettings.svelte';
</script>

<Modal
    name="settings"
    on:close
    ><div class="settings">
        <div class="categories">
            {#each settingsPages as page}
                <ActionButton
                    on:click={() => {
                        $settingsStore.currPage = page;
                    }}
                    type="button"
                    ><Icon name={page.icon} />
                    <p>{page.name}</p></ActionButton>
            {/each}
        </div>
        <div class="content">
            {#if $settingsStore.currPage.name === 'Playback'}
                Playback settings
            {:else if $settingsStore.currPage.name === 'Keyboard'}
                <KeyboardSettings />
            {/if}
        </div>
    </div>
</Modal>

<style lang="scss">
    .settings {
        display: flex;

        .categories {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 1rem; /* supported since chromium version 84 */

            :global(button) {
                width: 100%;
                width: 10rem;
            }
        }
    }
</style>
