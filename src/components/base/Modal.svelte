<script lang="ts">
    import { themeStore, applyTheme } from '@lib/theme';

    import { fade, fly } from 'svelte/transition';
    import Button from './Button.svelte';
    import Icon from './Icon.svelte';
    import { createEventDispatcher } from 'svelte';

    let className = '';
    export { className as class };
    export let name: string;

    // TODO -- keydown for `esc` key
    let dispatch = createEventDispatcher();
    function onClose() {
        dispatch('close');
    }
</script>

<div
    transition:fade
    style={applyTheme($themeStore)}
    class={`modal ${className}`}
    on:click|self={onClose}
    on:keydown|self={onClose}>
    <div
        class="con"
        transition:fly={{ y: 200, duration: 300 }}>
        <div class="controls">
            <p>{name.toUpperCase()}</p>
            <Button
                size="small"
                on:click={onClose}><Icon name="x" /></Button>
        </div>
        <div class="content">
            <slot />
        </div>
    </div>
</div>

<style lang="scss">
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba($color: #000000, $alpha: 0.5);
        display: flex;
        align-items: center;
        justify-content: center;

        .con {
            display: flex;
            flex-direction: column;
            border-radius: var(--border-radius);
            background-color: var(--background);
            padding: 1rem;

            .controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 0 1rem 0;

                & > p {
                    color: var(--primary);
                }
            }

            @media screen and (max-width: 35rem) {
                width: 100%;
                height: 100%;
                border-radius: 0;
            }
        }
    }
</style>
