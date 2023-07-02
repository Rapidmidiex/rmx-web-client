<script lang="ts">
    import { themeStore } from '@lib/theme';

    const sizes = {
        small: '1rem',
        medium: '1.5rem',
        big: '2rem',
    };

    export let src;
    let sizeName: 'small' | 'medium' | 'big' = 'medium';
    export { sizeName as size };
    $: size = sizes[sizeName];
    $: invert = $themeStore.variant === 'DARK';
</script>

{#if src}
    <img
        style={`width: ${size};
        height: ${size};
        max-width: ${size};
        max-height: ${size}; ${invert ? 'filter: invert(1);' : ''}`}
        {src}
        alt={src} />
{/if}

<style lang="scss">
    img {
        display: block;
    }
</style>
