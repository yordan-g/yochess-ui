<script lang="ts">
    import Board from "$lib/Board.svelte";
    import Spinner from "$lib/Spinner.svelte";
    import { onDestroy, onMount } from "svelte";
    import { closeWsConnection, connectToWs } from "$lib/webSocket";
    import { isLoading } from "$lib/webSocket";
    import { v4 as uuidv4 } from "uuid";

    onMount(() => {
        connectToWs(uuidv4());
    });

    onDestroy(() => {
        closeWsConnection();
    });

</script>

{#if $isLoading}
    <Spinner />
{:else}
    <Board />
{/if}
