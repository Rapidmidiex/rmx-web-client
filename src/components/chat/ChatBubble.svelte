<script lang="ts">
    import type { TextMessage } from '@lib/message';
    import { themeStore, applyTheme } from '@lib/theme';
    import { UserStore } from '@lib/user';
    import { fly } from 'svelte/transition';

    export let message: TextMessage; //NOTE -- would rather use the Payload<"text"> type here
</script>

<div
    in:fly={{ y: 200, duration: 300 }}
    style={applyTheme($themeStore) +
        `justify-content: ${
            message.userId === $UserStore.userId ? 'flex-end' : 'flex-start'
        };`}
    class="wrapper">
    <div class="bubble">
        <div class="details">
            <p class="username">{message.payload.displayName}</p>
        </div>
        <div class="body">
            <p>{message.payload.body}</p>
        </div>
    </div>
</div>

<style lang="scss">
    .wrapper {
        width: 100%;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        border-radius: var(--border-radius);

        .bubble {
            display: flex;
            flex-direction: column;
            min-width: 5rem;
            padding: 0.5rem;
            border-radius: var(--border-radius);
            background-color: var(--primary-light);
            color: var(--on-secondary);

            & > div {
                width: 100%;
                word-break: break-all;
            }

            .details {
                height: 1.5rem;
                font-size: 0.8rem;

                .username {
                    font-weight: bold;
                }
            }

            .body {
                height: 100%;
                font-size: 1rem;
            }
        }
    }
</style>
