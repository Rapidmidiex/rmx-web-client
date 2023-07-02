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
                    ><Icon
                        src={page.icon}
                        size="big" />
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
        align-items: flex-start;
        justify-content: flex-start;

        .categories {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 1rem; /* supported since chromium version 84 */

            :global(button) {
                width: 8rem;
            }
        }

        .content {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 0 1rem;
        }
    }
</style>
