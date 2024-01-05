<script lang="ts">
	import { GAME_STATE_KEY, getGameState } from "$lib/webSocket.svelte";
	import { gameResult } from "$lib/utils.svelte";

	let dialog: HTMLDialogElement;
	let game = getGameState(GAME_STATE_KEY);
	let endResult = $derived(gameResult(game.endState.winner));

	$effect(() => {
		if (game.endState.end && dialog) dialog.showModal();
	});
</script>
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation class="modal-c">
		<h2>{endResult}</h2>
		<div class="modal-btn">
			<button
				on:click={() => dialog.close()}
				class="button is-danger is-light">Close
			</button>
			<button autofocus class="button is-success is-light">Rematch</button>
			<button class="button is-success is-light">Play Again</button>
		</div>
	</div>
</dialog>

<style>
	.modal-c {
		display: grid;
		grid-template-rows: 1fr 1fr;
		height: 200px;
	}

	h2 {
		justify-self: center;
		align-self: center;
		font-weight: normal;
	}

	.modal-btn {
		display: flex;
		justify-content: space-around;
		align-items: end;
	}

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