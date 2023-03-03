<script lang="ts">
    import { Route, Router } from 'svelte-navigator';
    import Home from '@pages/Home.svelte';
    import Jam from '@pages/Jam.svelte';
    import { themeStore } from '@lib/theme';
</script>

<svelte:head>
    <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png" />
    <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png" />
    <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png" />
    <link
        rel="manifest"
        href="/site.webmanifest" />
    <link
        rel="mask-icon"
        href="/favicon/safari-pinned-tab.svg"
        color="#5bbad5" />
    <meta
        name="msapplication-TileColor"
        content="#da532c" />
    <meta
        name="theme-color"
        content={$themeStore.vars['--primary']} />
</svelte:head>

<main>
    <Router>
        <Route path="/">
            <Home />
        </Route>
        <!--should this pass params to the Jam component or read directly from JamStore?-->
        <Route
            path="/jam/:id"
            let:params>
            <Jam jamID={params.id} />
        </Route>
    </Router>
</main>

<style>
    @font-face {
        font-family: Raleway;
        src: url(./assets/fonts/Raleway-Regular.ttf);
    }

    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        outline: none;
        font-family: Raleway;
    }

    :global(::-webkit-scrollbar) {
        width: 0.5rem;
    }

    :global(::-webkit-scrollbar-track) {
        background: var(--background);
        border-radius: var(--border-radius);
    }

    :global(::-webkit-scrollbar-thumb) {
        background: var(--primary);
        border-radius: var(--border-radius);
    }

    :global(::-webkit-scrollbar-thumb:hover) {
        background: var(--primary-dark);
    }
</style>
