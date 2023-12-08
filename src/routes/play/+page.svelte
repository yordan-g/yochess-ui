<script lang="ts">
	import Spinner from "$lib/Spinner.svelte";
	import { onDestroy, onMount } from "svelte";
	import { v4 as uuidv4 } from "uuid";
	import { closeWsConnection, connectToWs, gameState } from "$lib/webSocket.svelte";
	import Board from "$lib/Board.svelte";


	onMount(() => {
		connectToWs(uuidv4());
	});

	onDestroy(() => {
		closeWsConnection();
	});

</script>


{#if gameState.game.isLoading}
	<Spinner />
{:else}
	<Board />
{/if}
