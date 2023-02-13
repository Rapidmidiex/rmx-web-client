<script lang="ts">
    import { applyTheme, themeStore } from '@store/theme';
    import { fade, fly } from 'svelte/transition';

    let className = '';
    export { className as class };
    export let closeFunc;
    export let width = 'auto';
    export let height = 'auto';

    let vars;
    $: vars = $themeStore.vars;
</script>

<div
    transition:fade
    style={applyTheme(vars)}
    class={`modal ${className}`}
    on:click|self={closeFunc}
    on:keydown|self={closeFunc}>
    <div
        transition:fly={{ y: 200, duration: 300 }}
        style="width: {width};height: {height};">
        <slot />
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

        & > div {
            background-color: var(--background);
            border-radius: 0.5rem;
            box-shadow: var(--shadow);
        }
    }
</style>
