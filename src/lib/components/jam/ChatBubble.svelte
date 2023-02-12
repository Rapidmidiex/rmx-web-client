<script lang="ts">
    import type { TextMsg } from '@lib/types/jam';
    import type { WSMsg } from '@lib/types/websocket';
    import { applyTheme, themeStore } from '@store/theme';
    import { UserStore } from '@store/user';

    export let message: WSMsg<TextMsg>;

    let vars;
    $: vars = $themeStore.vars;
</script>

<div
    style={applyTheme(vars) +
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
        padding: 0.3rem;
        display: flex;
        align-items: center;
        border-radius: var(--border-radius);

        .bubble {
            display: flex;
            flex-direction: column;
            min-width: 5rem;
            padding: 0.5rem;
            border-radius: var(--border-radius);
            background-color: var(--main-bg-inverse);
            color: var(--main-text-inverse);

            & > div {
                width: 100%;
                word-break: break-all;
            }

            .details {
                height: 1.5rem;
                font-size: 0.8rem;
            }

            .body {
                height: 100%;
                font-size: 1rem;
            }
        }
    }
</style>
