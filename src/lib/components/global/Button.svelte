<script lang="ts">
    import { applyTheme, themeStore } from '@store/theme';

    export let type: 'button' | 'submit' | 'reset' = 'button';
    export let size: 'small' | 'medium' | 'large' = 'medium';
    export let style: string = '';
    let className: string = '';
    export { className as class };

    let colors;
    $: colors = $themeStore.colors;
</script>

<button
    class={`${size} ${className}`}
    style={applyTheme(colors) + style}
    {type}
    on:click
    on:dblclick
    on:mouseover
    on:mouseenter
    on:mouseleave
    on:focus
    {...$$restProps}>
    <slot />
</button>

<style lang="scss">
    button {
        border: 1px solid var(--button-bg);
        outline: none;
        background-color: var(--button-bg);
        color: var(--button-text);
        border-radius: 0.5rem;
        font-size: 1rem;
        cursor: pointer;
        transition: 0.3s ease;
    }

    button:hover {
        background-color: transparent;
        color: var(--button-bg);
    }

    button.small {
        padding: 0.5rem;
    }

    button.medium {
        padding: 1rem;
    }

    button.large {
        padding: 2rem;
    }
</style>
