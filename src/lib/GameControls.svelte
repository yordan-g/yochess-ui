<script lang="ts">
	import { getGameState } from "$lib/webSocket.svelte";
	import { offerDraw } from "$lib/utils.svelte";

	let gameState = getGameState();

</script>

<div id="controls-c">
	<button onclick={() => offerDraw(gameState.config.wsClient, gameState.config.gameId)}>Offer draw</button>
	<button>Resign</button>
</div>

<style>

</style>
