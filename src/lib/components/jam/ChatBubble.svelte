<script lang="ts">
    import type { TextMsg } from 'src/lib/types/jam';
    import type { WSMsg } from 'src/lib/types/websocket';
    import { UserStore } from 'src/store/user';

    export let message: WSMsg<TextMsg>;
</script>

<div
    style={`justify-content: ${
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
        border-radius: 0.5rem;

        .bubble {
            display: flex;
            flex-direction: column;
            min-width: 5rem;
            padding: 0.5rem;
            border-radius: 0.5rem;
            background-color: #000;
            color: #fff;

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

    .wrapper:hover {
        background-color: #eaeaea;
    }
</style>
