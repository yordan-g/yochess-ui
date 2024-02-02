<script lang="ts">
	import { GAME_STATE_KEY, getGameState, sendMessage } from "$lib/webSocket.svelte";
	import { buildCloseEndMessage, buildRematchMessage, gameResult } from "$lib/utils.svelte";

	let { dialog } = $props();
	let game = getGameState(GAME_STATE_KEY);
	let endResult = $derived(gameResult(game.endState.winner));

	function closeDialog() {
		(dialog as HTMLDialogElement).close();
		sendMessage(game.state.game.ws, buildCloseEndMessage(game.state.game.gameId));
	}

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click|stopPropagation class="modal-c">
	<h2>{endResult}</h2>
	<div class="next-action-c">
		{#if game.endState.close || game.endState.leftGame }
			<span>Your opponent left the game!</span>
		{:else}
			<span>Hello</span>
		{/if}
	</div>
	<div class="modal-btn">
		<button
			onclick={closeDialog}
			class="button">Close
		</button>
		<button
			onclick={() => sendMessage(game.state.game.ws, buildRematchMessage(game.state.game.gameId))}
			autofocus class="button">Rematch
		</button>
		<a href="play" class="button"
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

	.modal-btn {
		display: flex;
		justify-content: space-around;
		align-items: end;
	}

	a {
		text-decoration: none;
		height: auto;
	}

</style>