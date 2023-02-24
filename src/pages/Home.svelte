<script lang="ts">
    import Button from '@lib/components/global/Button.svelte';
    import NavPage from '@lib/components/global/NavPage.svelte';
    import CreateSessionModal from '@lib/components/home/modals/CreateSessionModal.svelte';
    import JoinSessionModal from '@lib/components/home/modals/JoinSessionModal.svelte';

    let createModel = false;
    function toggleCreateModal() {
        createModel = !createModel;
    }

    let joinModal = false;
    function toggleJoinModal() {
        joinModal = !joinModal;
    }
</script>

<NavPage class="home">
    <div class="content">
        <section class="welcome">
            <h2>Welcome to Rapidmidiex!</h2>
            <br />
            <p>A new way for musicians to perform</p>
            <br />
            <div class="session-con">
                <Button on:click={toggleCreateModal}>Start a new Jam</Button>
                <Button on:click={toggleJoinModal}>Join</Button>
            </div>
        </section>
        {#if createModel}
            <CreateSessionModal closeFunc={toggleCreateModal} />
        {/if}
        {#if joinModal}
            <JoinSessionModal closeFunc={toggleJoinModal} />
        {/if}
    </div>
</NavPage>

<style lang="scss">
    :global(.home) {
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
