<script lang="ts">
    import { applyTheme, themeStore } from '@store/theme';

    export let type: 'button' | 'submit' | 'reset' = 'button';
    export let size: 'small' | 'medium' | 'large' = 'medium';
    export let style: string = '';
    let className: string = '';
    export { className as class };

    let vars;
    $: vars = $themeStore.vars;
</script>

<button
    class={`${size} ${className}`}
    style={applyTheme(vars) + style}
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
        border: var(--border);
        outline: none;
        background-color: var(--button-bg);
        color: var(--button-text);
        border-radius: var(--border-radius);
        font-size: 1rem;
        cursor: pointer;
        transition: 0.3s ease;
    }

    button:hover {
        background-color: var(--button-bg-hover);
        box-shadow: var(--shadow);
        color: var(--button-text-hover);
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
