<script lang="ts">
	import { GAME_STATE_KEY, getGameState } from "$lib/webSocket.svelte";
	import type { GameState } from "$lib/types";
	import { stopEventPropagation } from "$lib/utils.svelte";

	let { dialog } = $props();
	let gameState: GameState = getGameState(GAME_STATE_KEY);

	function closeDialog() {
		(dialog as HTMLDialogElement).close();
	}

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onclick={stopEventPropagation}
	onkeydown={stopEventPropagation}
	class="modal-c">
	<span>{gameState.communicationError.userMessage}</span>
	<button onclick={closeDialog} class="button">Close</button>
</div>

<style>
	.modal-c {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 30px;
		gap: 50px;
	}
</style>
