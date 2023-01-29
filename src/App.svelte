<script lang="ts">
    import { Route, Router } from 'svelte-navigator';
    import Home from './pages/home/Home.svelte';
    import Jam from './pages/jam/Jam.svelte';
</script>

<svelte:head>
    <link
        rel="apple-touch-icon"
        sizes="57x57"
        href="favicon/apple-icon-57x57.png" />
    <link
        rel="apple-touch-icon"
        sizes="60x60"
        href="favicon/apple-icon-60x60.png" />
    <link
        rel="apple-touch-icon"
        sizes="72x72"
        href="favicon/apple-icon-72x72.png" />
    <link
        rel="apple-touch-icon"
        sizes="76x76"
        href="favicon/apple-icon-76x76.png" />
    <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="favicon/apple-icon-114x114.png" />
    <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="favicon/apple-icon-120x120.png" />
    <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="favicon/apple-icon-144x144.png" />
    <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="favicon/apple-icon-152x152.png" />
    <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="favicon/apple-icon-180x180.png" />
    <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="favicon/android-icon-192x192.png" />
    <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="favicon/favicon-32x32.png" />
    <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="favicon/favicon-96x96.png" />
    <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="favicon/favicon-16x16.png" />
    <link
        rel="manifest"
        href="favicon/manifest.json" />
    <meta
        name="msapplication-TileColor"
        content="#ffffff" />
    <meta
        name="msapplication-TileImage"
        content="favicon/ms-icon-144x144.png" />
    <meta
        name="theme-color"
        content="#ffffff" />
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

    :global(.page) {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    :global(.inpt) {
        padding: 1rem;
        outline: none;
        border: none;
        background-color: #eaeaea;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        border-bottom: 3px solid #808080;
        transition: 0.3s ease;
    }

    :global(.inpt:focus) {
        background-color: #cfcfcf;
        border-bottom: 3px solid #000;
    }

    :global(.btn) {
        border: 1px solid #000;
        outline: none;
        background-color: #000;
        color: #fff;
        border-radius: 0.5rem;
        font-size: 1rem;
        cursor: pointer;
        transition: 0.3s ease;
    }

    :global(.btn:hover) {
        background-color: transparent;
        color: #000;
    }
</style>
