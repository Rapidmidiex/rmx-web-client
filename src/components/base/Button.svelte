<script lang="ts">
    import { themeStore, applyTheme } from '@lib/theme';

    export let type: 'button' | 'submit' | 'reset' = 'button';
    export let size: 'small' | 'medium' | 'large' = 'medium';
    export let style = '';
    let className = '';
    export { className as class };
</script>

<button
    class={`${size} ${className}`}
    style={applyTheme($themeStore) + style}
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
        border: none;
        outline: none;
        background-color: var(--primary);
        color: var(--on-primary);
        border-radius: var(--border-radius);
        font-size: 1rem;
        cursor: pointer;
        transition: 0.3s ease;
    }

    button:hover {
        background-color: var(--primary-dark);
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
