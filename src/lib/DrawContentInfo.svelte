<script lang="ts">
	import { denyDraw, offerDraw } from "$lib/utils.svelte";
	import { getGameState } from "$lib/webSocket.svelte";

	let { dialog } = $props();
	let gameState = getGameState();
</script>

<div id="draw-c">
	<h3>Your opponent is offering a draw</h3>
	<div id="draw-btns">
		<button class="end-btn red-b"
			onclick={() => {
			dialog?.close();
			denyDraw(gameState.config.wsClient, gameState.config.gameId)
		}}>Deny
		</button>
		<button class="end-btn green-b"
			onclick={() => {
			dialog?.close();
			offerDraw(gameState.config.wsClient, gameState.config.gameId)
		}}>Accept
		</button>
	</div>
</div>

<style>
	#draw-c {
		display: flex;
		flex-direction: column;
		margin: 1em 0em 1em 0em;
	}

	h3 {
		text-align: center;
		font-weight: normal;
	}

	#draw-btns {
		display: flex;
		justify-content: center;
		gap: 3em;
		margin: 1em 1em 1em 1em;
	}

</style>
