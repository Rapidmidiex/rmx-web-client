<script lang="ts">
    import { applyTheme, switchTheme, themeStore } from '@lib/theme';
    import { Link } from 'svelte-navigator';
    import { fly } from 'svelte/transition';
    import Button from './Button.svelte';
    import Icon from './Icon.svelte';

    function toggleTheme() {
        $themeStore.name === 'DARK_THEME'
            ? switchTheme('LIGHT_THEME')
            : switchTheme('DARK_THEME');
    }

    let vars;
    $: vars = $themeStore.vars;
</script>

<div class="con">
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
</div>

<style lang="scss">
    .con {
        height: inherit;
        width: 5rem;

        nav {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: column;
            background-color: var(--background-accent);
            padding: 0.5rem;
            overflow: hidden;

            & > div {
                width: 100%;
            }

            & > .logo-con {
                display: flex;
                align-items: center;
                justify-content: center;

                & > .logo {
                    width: 100%;
                    height: 100%;
                    width: 4rem;
                    height: 4rem;

                    & > :global(a) {
                        widows: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: var(--border-radius);
                        text-decoration: none;
                        transition: 0.3s ease;
                        background-image: url('../../../assets/RMX-logo-500.png');
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
                justify-content: flex-start;
                flex-direction: column;
                height: 100%;

                & > :global(a) {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-direction: column;
                    text-decoration: none;
                    color: var(--on-background);
                    width: inherit;
                    padding: 0.8rem 0;
                    border-radius: var(--border-radius);
                    transition: 0.3s ease;
                }

                :global(a:hover) {
                    color: var(--primary);
                }
            }

            & > .nav-options {
                display: flex;
                align-items: center;
                flex-direction: column;
            }
        }

        @media screen and (max-width: 35rem) {
            width: 100%;
            height: 5rem;

            nav {
                flex-direction: row;

                & > div {
                    height: 100%;
                    width: auto;
                }

                .nav-items {
                    width: 100%;
                    flex-direction: row-reverse;

                    :global(a) {
                        padding: 0.5rem;
                    }
                }
            }
        }
    }
</style>
