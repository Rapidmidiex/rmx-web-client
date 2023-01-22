<script lang="ts">
    import { JamStore, JamTextStore } from '../../../store/jam';
    import Icon from '../../../lib/components/Icon.svelte';
    import { WSMsgTyp, type WSMsg } from '../../../models/websocket';
    import { UserStore } from '../../../store/user';

    let message: string;
    let messagesDiv: HTMLDivElement = null;

    function sendWSMsg(msg: WSMsg<string>) {
        $JamStore.ws.send(JSON.stringify(msg));
    }

    function sendMsg() {
        let msg: WSMsg<string> = {
            type: WSMsgTyp.TEXT,
            payload: message,
            userId: $UserStore.userId,
        };

        sendWSMsg(msg);
        // should scroll immediately on user input
        // and listen for new messages then scroll to bottom
        setTimeout(() => {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 500);
    }
</script>

<div class="chat">
    <div
        bind:this={messagesDiv}
        class="messages">
        {#if $JamTextStore.length > 0}
            {#each $JamTextStore as msg}
                <p>{msg}</p>
            {/each}
        {:else}
            <p>No message available</p>
        {/if}
    </div>
    <form
        class="input"
        on:submit|preventDefault={sendMsg}>
        <input
            type="text"
            placeholder="Write your message here..."
            bind:value={message} />
        <button
            class="btn"
            type="submit"><Icon name="send" /></button>
    </form>
</div>

<style lang="scss">
    .chat {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0px 0px 10px rgba($color: #000000, $alpha: 0.3);

        .messages {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            overflow: auto;

            & > p {
                background-color: #000;
                padding: 1rem;
                color: #fff;
                font-size: 1rem;
                border-radius: 0.5rem;
                margin: 0.5rem;
                word-break: break-all;
            }
        }

        .input {
            width: 100%;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #dadada;
            border-radius: 0.5rem;
            padding: 0 0.5rem;

            & > input {
                width: 100%;
                outline: none;
                border: none;
                background-color: transparent;
            }

            & > button {
                padding: 0.5rem;
            }
        }
    }
</style>
