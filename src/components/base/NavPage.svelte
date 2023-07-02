<script lang="ts">
    import { themeStore, applyTheme } from '@lib/theme';

    import Nav from './Nav.svelte';

    let className: string;
    export { className as class };
</script>

<div
    class="nav-page"
    style={applyTheme($themeStore)}>
    <div>
        <Nav />
    </div>
    <div class={`${className} content`}>
        <slot />
    </div>
</div>

<style lang="scss">
    .nav-page {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: var(--background);
        color: var(--on-background);
        display: flex;
        flex-direction: column;

        & > div {
            width: 100%;
        }

        .content {
            width: 100%;
        }
    }
</style>
