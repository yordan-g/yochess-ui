<script lang="ts">
	import { GAME_STATE_KEY, getGameState } from "$lib/webSocket.svelte";

	let { dialog } = $props();
	let game = getGameState(GAME_STATE_KEY);

	function closeDialog() {
		(dialog as HTMLDialogElement).close();
	}

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click|stopPropagation class="modal-c">
	<span>{game.communicationError.userMessage}</span>
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