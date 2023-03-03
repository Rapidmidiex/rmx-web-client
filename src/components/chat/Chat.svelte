<script lang="ts">
    import { v4 as uuid } from "uuid";
    import ChatBubble from "./ChatBubble.svelte";
    import { jamStore } from "@lib/jam";
    import { pingStats } from "@lib/ping";
    import Icon from "../base/Icon.svelte";
    import { chatStore } from "@lib/jam/chat";
    import Button from "../base/Button.svelte";
    import TextInput from "../base/TextInput.svelte";
    import { themeStore, applyTheme } from "@lib/theme";
    import { fly } from "svelte/transition";
    import { UserStore } from "@lib/user";
    import type { Message, TextMessage } from "@lib/message";

    let message: string;
    let messagesDiv: HTMLDivElement = null;

    function sendWSMsg(message: Message) {
        // TODO -- try to not expose this outside of the store
        $jamStore.ws.send(JSON.stringify(message));
    }

    function sendMsg() {
        let _message: TextMessage = {
            id: uuid(),
            type: "text",
            payload: {
                body: message,
                displayName: $UserStore.userName,
            },
            userId: $UserStore.userId,
        };

        pingStats.msgOut(_message.id);
        sendWSMsg(_message);

        // reset input
        message = "";

        // should scroll immediately on user input
        // and listen for new messages then scroll to bottom
        setTimeout(() => {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 500);
    }
</script>

<div
    style={applyTheme($themeStore)}
    class="chat"
    transition:fly={{ x: 200, duration: 300 }}>
    <div
        bind:this={messagesDiv}
        class="messages">
        {#if $chatStore.length > 0}
            {#each $chatStore as message}
                <ChatBubble {message} />
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
