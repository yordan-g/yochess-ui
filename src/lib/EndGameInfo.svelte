<script lang="ts">
	import { GAME_STATE_KEY, getGameState, sendMessage } from "$lib/webSocket.svelte";
	import { buildCloseEndMessage, buildRematchMessage, gameResult } from "$lib/utils.svelte";

	let { dialog } = $props();
	let game = getGameState(GAME_STATE_KEY);
	let endWinner = $derived(gameResult(game.endState.gameOver?.winner));

	function closeDialog() {
		(dialog as HTMLDialogElement).close();
		sendMessage(game.state.game.ws, buildCloseEndMessage(game.state.game.gameId));
	}

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click|stopPropagation class="modal-c">
	<h2>{game.endState.gameOver.result} {endWinner}</h2>
	<div class="next-action-c">
		{#if game.endState.close || game.endState.leftGame }
			<span class="red-t">Your opponent left the game!</span>
		{:else}
			<span>You can offer rematch or start another game!</span>
		{/if}
	</div>
	<div class="modal-btn">
		<button
			onclick={closeDialog}
			class="end-btn red-b">Close
		</button>
		<button
			onclick={() => sendMessage(game.state.game.ws, buildRematchMessage(game.state.game.gameId))}
			class="end-btn green-b">Rematch
		</button>
		<a href="play" class="end-btn green-b"
		   onclick={closeDialog}
		   data-sveltekit-reload>Play Again
		</a>
	</div>
</div>

<style>
	h2 {
		justify-self: center;
		align-self: center;
		font-weight: normal;
	}

	.modal-c {
		display: grid;
		grid-template-rows: 1fr auto 1fr;
		height: 200px;
	}

	.next-action-c {
		justify-self: center;
	}

	.modal-btn {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	a {
		text-decoration: none;
		height: auto;
	}

	.end-btn {
		border: 1px solid var(--button-color);
		color: var(--button-color);
		background-color: transparent;
		padding: 10px 10px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 10px;
		transition: background-color 0.3s, color 0.3s;
	}

	.end-btn:hover {
		color: white; /* White text on hover */
		background-color: var(--button-color);
	}

</style>