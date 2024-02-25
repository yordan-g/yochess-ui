<script lang="ts">
	import { goto } from "$app/navigation";
	import { GAME_STATE_KEY, getGameState, sendMessage } from "./webSocket.svelte";
	import { buildCloseEndMessage } from "./utils.svelte";
	import EndGameInfo from "$lib/EndGameInfo.svelte";
	import CommunicationErrorInfo from "$lib/CommunicationErrorInfo.svelte";
	import type { GameState } from "$lib/types";

	let dialog: HTMLDialogElement;
	let gameState: GameState = getGameState(GAME_STATE_KEY);

	$effect(() => {
		if (dialog &&
			(gameState.endState.ended || gameState.communicationError.isPresent)
		) {
			dialog.showModal();
		}
	});

	$effect(() => {
		if (gameState.endState.rematchSuccess && dialog) {
			dialog.close();

			goto(`/redirect`, {
				replaceState: true,
				invalidateAll: true,
				state: { rematchGameId: gameState.endState.rematchGameId }
			});
		}
	});

	function closeDialog() {
		dialog.close();
		if (gameState.endState.ended) {
			sendMessage(gameState.config.wsClient, buildCloseEndMessage(gameState.config.gameId));
		}
	}

	function escClick(event: KeyboardEvent) {
		// console.log("key pressed", event.key);
		if (event.key === "Escape") {
			closeDialog();
		}
	}
</script>
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:click|self={closeDialog}
	onkeydown={escClick}
>
	{#if gameState.endState.ended || gameState.endState.close || gameState.endState.leftGame }
		<EndGameInfo closeDialog={closeDialog} />
	{:else if gameState.communicationError.isPresent }
		<CommunicationErrorInfo dialog={dialog} />
	{/if}

</dialog>

<style>
	dialog {
		width: 400px;
		/*max-width: 32em;*/
		border-radius: 15px;
		border: none;
		padding: 0;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	dialog > div {
		padding: 1em;
	}

	dialog[open] {
		animation: zoom 1s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.5s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
