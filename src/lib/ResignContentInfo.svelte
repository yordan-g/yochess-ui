<script lang="ts">
	import { getGameState } from "$lib/webSocket.svelte";
	import { resignationConfirm } from "$lib/utils.svelte";

	let { dialog } = $props();
	let gameState = getGameState();
</script>

<div id="resign-c" data-testid="resign-content-info">
	<h3>Are you sure you want to resign?</h3>
	<div id="resign-btns">
		<button
			class="end-btn red-b"
			onclick={
				() => {
					dialog?.close();
					// resetting the state so that dialog shows for subsequent resignation attempts
					// this could be reworked so that state is driven only from the backend, like draw offer.
					gameState.resignState.requestedResignation = false;
				}
			}>Cancel
		</button>
		<button
			class="end-btn green-b"
			onclick={() => {
				dialog?.close();
				resignationConfirm(gameState.config.wsClient, gameState.config.gameId)
			}}>Confirm
		</button>
	</div>
</div>

<style>

	#resign-c {
		display: flex;
		flex-direction: column;
		margin: 1em 0em 1em 0em;
	}

	h3 {
		text-align: center;
		font-weight: normal;
	}

	#resign-btns {
		display: flex;
		justify-content: center;
		gap: 3em;
		margin: 1em 1em 1em 1em;
	}

</style>
