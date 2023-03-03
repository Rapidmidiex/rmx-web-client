<script lang="ts">
    import { themeStore, applyTheme } from "@lib/theme";

    let className: string;
    export { className as class };
</script>

<div
    class={className}
    style={applyTheme($themeStore)}>
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
