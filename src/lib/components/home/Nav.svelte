<script lang="ts">
    import { applyTheme, switchTheme, themeStore } from '@store/theme';
    import { Link } from 'svelte-navigator';
    import { fly } from 'svelte/transition';
    import Button from '../global/Button.svelte';
    import Icon from '../global/Icon.svelte';

    function toggleTheme() {
        $themeStore.name === 'DARK_THEME'
            ? switchTheme('LIGHT_THEME')
            : switchTheme('DARK_THEME');
    }

    let vars;
    $: vars = $themeStore.vars;
</script>

<nav
    transition:fly={{ x: -200, duration: 300, delay: 300 }}
    style={applyTheme(vars)}>
    <div class="logo-con">
        <div class="logo">
            <Link to="/" />
        </div>
    </div>
    <div class="nav-items">
        <Link to="/"
            ><Icon name="home" />
            <p>Home</p></Link>
        <Link to="/learn">
            <Icon name="book-open" />
            <p>Learn</p></Link>

        <a
            href="https://github.com/Rapidmidiex/rmx-web-client"
            target="_blank"
            rel="noopener noreferrer">
            <Icon name="github" />
            <p>GitHub</p></a>
    </div>
    <div class="nav-options">
        <Button on:click={toggleTheme}
            ><Icon
                name={$themeStore.name === 'DARK_THEME'
                    ? 'moon'
                    : 'sun'} /></Button>
    </div>
    <!-- <div class="nav-account">
        <Link to="/account" />
    </div> -->
</nav>

<style lang="scss">
    nav {
        width: 5rem;
        height: 100vh;
        display: flex;
        align-items: center;
        flex-direction: column;
        box-shadow: var(--shadow);
        background-color: var(--background);

        & > div {
            width: 100%;
        }

        & > .logo-con {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 5rem;
            padding: 0.5rem;

            & > .logo {
                width: 100%;
                height: 100%;

                & > :global(a) {
                    widows: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--border-radius);
                    text-decoration: none;
                    transition: 0.3s ease;
                    background-image: url('../../../assets/RMX-logo-256.jpg');
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                }

                & > :global(a:hover) {
                    transform: scale(0.9);
                }
            }
        }

        & > .nav-items {
            display: flex;
            align-items: center;
            flex-direction: column;
            padding: 0.25rem 0;

            & > :global(a) {
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                flex-direction: column;
                text-decoration: none;
                color: var(--on-background);
                width: 4rem;
                height: 4rem;
                margin: 0.25rem 0.5rem;
                border-radius: var(--border-radius);
                transition: 0.3s ease;
            }

            & > :global(a:hover) {
                background-color: var(--primary);
                box-shadow: var(--shadow);
                color: var(--on-primary);
            }
        }

        & > .nav-options {
            display: flex;
            align-items: center;
            flex-direction: column;
        }
    }
</style>
