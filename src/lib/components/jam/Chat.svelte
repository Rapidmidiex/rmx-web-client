<script lang="ts">
    import { v4 as uuidv4 } from 'uuid';
    import ChatBubble from './ChatBubble.svelte';
    import { WSMsgTyp, type WSMsg } from 'src/lib/types/websocket';
    import type { TextMsg } from 'src/lib/types/jam';
    import { JamStore, JamTextStore } from 'src/store/jam';
    import { UserStore } from 'src/store/user';
    import Icon from '../global/Icon.svelte';
    import { pingStats } from 'src/store/ping';

    let message: string;
    let messagesDiv: HTMLDivElement = null;

    function sendWSMsg(msg: WSMsg<TextMsg>) {
        $JamStore.ws.send(JSON.stringify(msg));
    }

    function sendMsg() {
        let msg: WSMsg<TextMsg> = {
            id: uuidv4(),
            type: WSMsgTyp.TEXT,
            payload: {
                body: message,
                displayName: $UserStore.userName,
            },
            userId: $UserStore.userId,
        };

        pingStats.msgOut(msg.id);
        sendWSMsg(msg);

        // reset input
        message = '';

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
                <ChatBubble message={msg} />
            {/each}
        {:else}
            <div class="empty">No message available</div>
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

            .empty {
                width: 100%;
                text-align: center;
                padding: 0.5rem;
            }
        }

        .input {
            width: 100%;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #eaeaea;
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
