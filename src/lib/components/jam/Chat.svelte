<script lang="ts">
    import { v4 as uuidv4 } from 'uuid';
    import ChatBubble from './ChatBubble.svelte';
    import { WSMsgTyp, type WSMsg } from '@lib/types/websocket';
    import type { TextMsg } from '@lib/types/jam';
    import { JamStore } from '@store/jam';
    import { UserStore } from '@store/user';
    import { pingStats } from '@store/ping';
    import Icon from '../global/Icon.svelte';
    import { ChatStore } from '@store/chat';
    import Button from '../global/Button.svelte';
    import TextInput from '../global/TextInput.svelte';
    import { applyTheme, themeStore } from '@store/theme';
    import { fly } from 'svelte/transition';

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

    let vars;
    $: vars = $themeStore.vars;
</script>

<div
    style={applyTheme(vars)}
    class="chat"
    transition:fly={{ x: 200, duration: 300 }}>
    <div
        bind:this={messagesDiv}
        class="messages">
        {#if $ChatStore.length > 0}
            {#each $ChatStore as msg}
                <ChatBubble message={msg} />
            {/each}
        {:else}
            <div class="empty">No message available</div>
        {/if}
    </div>
    <form
        class="input"
        on:submit|preventDefault={sendMsg}>
        <TextInput
            placeholder="Write your message here..."
            bind:value={message} />
        <Button
            size="small"
            type="submit"><Icon name="send" /></Button>
    </form>
</div>

<style lang="scss">
    .chat {
        width: 20rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: var(--background-accent);
        border-radius: var(--border-radius);
        padding: 0.5rem;

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
            background-color: var(--background);
            border-radius: var(--border-radius);
            padding: 0 0.5rem;
            transition: 0.3s ease;

            :global(input) {
                width: 100%;
                outline: none;
                border: none;
                background-color: transparent;
                color: var(--on-background);
            }
        }
    }
</style>
