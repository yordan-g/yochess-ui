<script lang="ts">
	import { GAME_STATE_KEY, getGameState, sendMessage } from "$lib/webSocket.svelte";
	import { buildRematchMessage, gameResult, stopEventPropagation } from "$lib/utils.svelte";
	import type { GameState } from "$lib/types";
	import { fade } from "svelte/transition";
	import { goto } from "$app/navigation";

	let { closeDialog } = $props<{ closeDialog: Function }>();
	let gameState: GameState = getGameState(GAME_STATE_KEY);
	let endWinner = $derived(gameResult(gameState.endState.gameOver?.winner));
	let rematchOffered = $state(false);

	let closeButton: HTMLButtonElement;

	function offerRematch() {
		sendMessage(gameState.config.wsClient, buildRematchMessage(gameState.config.gameId));
		rematchOffered = true;
		closeButton.focus();
	}

	function rematchKeydown(event: KeyboardEvent) {
		if (event.key === "Escape") closeDialog();
	}

	function playAgainHandler() {
		closeDialog();
		// console.warn("redirect from button");
		// Sveltekit does not replace state correctly when goto from '/play' to '/play'. That is why we do a fake redirect.
		goto("/")
			.then(() => {
				goto("/play", { replaceState: true, state: {} });
			});
	}

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div onclick={stopEventPropagation} class="modal-c" data-testid="end-game-modal">
	<h2 in:fade={{delay: 100, duration: 700 }}>
		{gameState.endState.gameOver?.result} {endWinner}
	</h2>
	<!-- todo fix rematchOffered && close is not true -->
	<div class="next-action-c">
		{#if rematchOffered && !gameState.endState.close }
			<span
				in:fade={{delay: 100, duration: 700 }}
				class="green-t">Waiting for the opponent to accept
			</span>
		{:else if gameState.endState.close || gameState.endState.leftGame }
			<span
				in:fade={{delay: 100, duration: 700 }}
				class="red-t">Your opponent left the game
			</span>
		{:else}
			<span in:fade={{delay: 100, duration: 700 }}>
				You can offer rematch or start another game
			</span>
		{/if}
	</div>
	<div in:fade={{delay: 100, duration: 700 }} class="modal-btn">
		<button
			bind:this={closeButton}
			onclick={closeDialog}
			class="end-btn red-b">Close
		</button>
		<button
			onclick={offerRematch}
			class="end-btn green-b"
			disabled={rematchOffered}
			onkeydown={rematchKeydown}>Rematch
		</button>
		<button
			class="end-btn green-b"
			onclick={playAgainHandler}>Play Again
		</button>
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

</style>
