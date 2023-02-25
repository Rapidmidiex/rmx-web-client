<script lang="ts">
    import { applyTheme, themeStore } from '@store/theme';

    let className;
    export { className as class };

    let vars;
    $: vars = $themeStore.vars;
</script>

<div
    class={className}
    style={applyTheme(vars)}>
    <slot />
</div>

<style lang="scss">
    div {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: var(--background);
        color: var(--on-background);
    }
</style>
