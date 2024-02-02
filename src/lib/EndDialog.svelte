<script lang="ts">
	import { goto } from "$app/navigation";
	import { GAME_STATE_KEY, getGameState, sendMessage } from "./webSocket.svelte";
	import { buildCloseEndMessage } from "./utils.svelte";
	import EndGameInfo from "$lib/EndGameInfo.svelte";
	import CommunicationErrorInfo from "$lib/CommunicationErrorInfo.svelte";

	let dialog: HTMLDialogElement;
	let game = getGameState(GAME_STATE_KEY);

	$effect(() => {
		if (dialog &&
			(game.endState.ended || game.communicationError.isPresent)
		) {
			dialog.showModal();
		}
	});

	$effect(() => {
		if (game.endState.rematchSuccess && dialog) {
			let queryParams = new URLSearchParams({ rematchGameId: game.endState.rematchGameId, }).toString();
			goto(`/play?${queryParams}`);
		}
	});

	function closeDialog() {
		dialog.close();
		if (game.endState.ended) {
			sendMessage(game.state.game.ws, buildCloseEndMessage(game.state.game.gameId));
		}
	}
</script>
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:click|self={closeDialog}
>
	{#if game.endState.ended || game.endState.close || game.endState.leftGame }
		<EndGameInfo dialog={dialog} />
	{:else if game.communicationError.isPresent }
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
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
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
		animation: fade 0.2s ease-out;
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