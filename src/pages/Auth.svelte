<script lang="ts">
    import { Icons } from '@assets/icons';
    import Icon from '@components/base/Icon.svelte';
    import Page from '@components/base/Page.svelte';
    import { applyTheme, themeStore } from '@lib/theme';

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('accessToken')) {
        console.log(urlParams.get('accessToken'));
    }
</script>

<Page class="auth-page">
    <div
        class="con"
        style={applyTheme($themeStore)}>
        <div>
            <h2>Login with</h2>
            <a href="http://localhost:8000/v0/auth/github">
                <Icon src={Icons.Github} />
                GitHub</a>
            <a href="http://localhost:8000/v0/auth/google">
                <Icon src={Icons.Google} />
                Google</a>
        </div>
        <div class="welcome" />
    </div>
    <p>Rapidmidiex</p>
</Page>

<style lang="scss">
    :global(.auth-page) {
        display: flex;
        align-items: center;
        justify-content: center;

        & > div {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            h2 {
                padding: 1rem;
                font-weight: bold;
                text-align: center;
            }

            a {
                background-color: var(--background-accent);
                color: var(--on-background);
                text-decoration: none;
                margin: 0.5rem;
                border-radius: var(--border-radius);
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 15rem;
                border: 8px solid var(--background-accent);
                padding: 0.5rem 1rem;
                font-weight: bold;
                font-size: 1.2rem;
            }
        }

        & > p {
            font-size: 2rem;
            font-weight: bold;
            color: var(--on-background);
            position: absolute;
            bottom: 0.5rem;
            left: 50%;
            transform: translateX(-50%);
        }
    }
</style>
