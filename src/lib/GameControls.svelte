<script lang="ts">
	import { getGameState } from "$lib/webSocket.svelte";
	import { offerDraw, resignRequest } from "$lib/utils.svelte";

	let gameState = getGameState();

</script>

<div id="controls-c">
	<button
		class="control-btns"
		disabled={gameState.drawState.drawLimitExceeded}
		onclick={() => offerDraw(gameState.config.wsClient, gameState.config.gameId)}>Offer draw
	</button>
	<button
		class="control-btns"
		onclick={() => resignRequest(gameState.config.wsClient, gameState.config.gameId)}>Resign
	</button>
</div>

<style>
	#controls-c {
		display: flex;
		justify-content: center;
		gap: 1em;
	}

	.control-btns {
		padding: 0.3em;
		border: 0.05em solid var(--button-color);
		color: var(--button-color);
		background-color: transparent;
		text-decoration: none;
		cursor: auto;
		border-radius: 0.5em;
		font-size: clamp(var(--text-s), 1.5vw, var(--text-m));
	}

	.control-btns:not(:disabled):hover {
		color: white;
		background: var(--purple-gradien);
		border: 0.05em solid white;
	}

	.control-btns:disabled {
		color: var(--disabled-color);
		border: 1px solid var(--disabled-color);
		background-color: transparent;
		cursor: not-allowed;
	}

	@media only screen and (max-width: 480px) {
		.control-btns {
			font-size: 0.8rem;
		}
	}
</style>
