<script lang="ts">
    import Button from '@components/base/Button.svelte';
    import NavPage from '@components/base/NavPage.svelte';
    import CreateSessionModal from '@components/modals/CreateSessionModal.svelte';
    import JoinSessionModal from '@components/modals/JoinSessionModal.svelte';
    import { createToggle } from '@lib/toggle';

    const toggleCreate = createToggle(false);
    const toggleJoin = createToggle(false);
</script>

<NavPage class="home-page">
    <div class="content">
        <section class="welcome">
            <h2>Welcome to Rapidmidiex!</h2>
            <br />
            <p>A new way for musicians to perform</p>
            <br />
            <div class="session-con">
                <Button on:click={toggleCreate.toggle}>Start a new Jam</Button>
                <Button on:click={toggleJoin.toggle}>Join</Button>
            </div>
        </section>
        {#if $toggleCreate}
            <CreateSessionModal on:close={toggleCreate.toggle} />
        {/if}
        {#if $toggleJoin}
            <JoinSessionModal on:close={toggleJoin.toggle} />
        {/if}
    </div>
</NavPage>

<style lang="scss">
    :global(.home-page) {
        display: flex;

        & > .content {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-direction: column;
            width: 100%;
            height: 100%;

            & > .welcome {
                padding: 3rem;
                width: 100%;

                & > h2 {
                    font-size: 3rem;
                    font-weight: bold;
                }

                & > p {
                    font-size: 1.5rem;
                }

                & > .session-con {
                    display: flex;
                    flex-wrap: wrap;

                    :global(button) {
                        margin: 0.25rem;
                    }
                }
            }
        }
    }
</style>
