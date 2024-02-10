<script lang="ts">
	import { fade } from "svelte/transition";
	import { getGameState, initBoard } from "./webSocket.svelte";
	import { onMount } from "svelte";
	import "cm-chessboard/assets/chessboard.css";
	import "cm-chessboard/assets/extensions/markers/markers.css";
	import "cm-chessboard/assets/extensions/promotion-dialog/promotion-dialog.css";

	const game = getGameState();

	onMount(() => {
		initBoard(game.state);
	});

</script>

<div in:fade="{{ duration: 700 }}" class="board"
	 id="containerId">
</div>

<style>
	.board {
		flex: 1;
		display: flex;
	}
</style>