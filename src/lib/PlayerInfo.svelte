<script lang="ts">
	import { getGameState } from "$lib/webSocket.svelte";
	import { piecesMap, compareFn } from "$lib/utils";

	let { color } = $props();
	const game = getGameState();

	let captures = $derived(
		color === "w" ? game.state.lastMove.whiteCaptures : game.state.lastMove.blackCaptures
	);

</script>

<div class="player-info">
	<div class="user-c">
		<i class="fa fa-user-circle fa-2x" aria-hidden="true"></i>
		<span>Yordan</span>
	</div>
	<div class="time-c">
		<span>05:00</span>
	</div>
	<div class="pieces-c">
		{#each captures.toSorted(compareFn) as piece}
			<span>{@html piecesMap.get(piece)}</span>
		{/each}
	</div>
</div>


<style>
	.player-info {
		display: grid;
		grid-template-columns: 1fr 1fr 3fr;
		/*border: 1px solid black;*/
	}

	.user-c {
		display: flex;
		justify-content: center;
		align-items: center;
		column-gap: 10px;
	}

	.time-c {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: x-large;
		border: 2px solid #bb34a3;
		border-radius: 15px;
	}

	.pieces-c {
		display: flex;
		justify-content: end;
		column-gap: 5px;
		align-items: center;
		font-size: x-large;
	}

	span {
		font-size: larger;
	}

	i {
		color: #2c1252;
	}
</style>
