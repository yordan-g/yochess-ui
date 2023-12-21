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
<!--		<i class="fa fa-user-circle fa-2x" aria-hidden="true"></i>-->
		<span class="material-symbols-outlined i-face">face_6</span>
		<span>Yordan Ganev</span>
	</div>
	<div class="time-c">
		<span>03:59</span>
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
		grid-template-columns: 200px 100px 2fr;
	}

	.user-c {
		display: flex;
		justify-content: start;
		align-items: center;
		column-gap: 10px;
	}

	.time-c {
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: "Digital Bold", Helvetica;
		font-size: 35px;
		border-radius: 15px;
		box-shadow: rgba(80, 80, 80, 0.6) inset 0px 7px 2px -3px,
		rgba(80, 80, 80, 0.6) inset 3px 10px 10px -3px;
	}

	.pieces-c {
		display: flex;
		justify-content: end;
		column-gap: 5px;
		align-items: center;
		font-size: x-large;
	}

	.user-c span {
		font-size: 18px;
	}
	.i-face {
		font-size: 40px !important;
	}

	i {
		color: #2c1252;
	}

	 .material-symbols-outlined {
		 font-variation-settings:
			 'FILL' 0,
			 'wght' 200,
			 'GRAD' 0,
			 'opsz' 24
	 }
</style>
