<script lang="ts">
	import { getGameState } from "$lib/webSocket.svelte";
	import type { GameState } from "$lib/types";
	import { stopEventPropagation } from "$lib/utils.svelte";

	let { dialog }: { dialog: HTMLDialogElement | null } = $props();
	let gameState: GameState = getGameState();

	function closeDialog() {
		dialog?.close();
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
