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
		width: 600px;

		box-shadow: rgba(80, 80, 80, 1) 0px 3px 3px -2px,
		rgba(80, 80, 80, 1) 0px 5px 3px -3px,
		rgba(80, 80, 80, 1) 0px 8px 3px -4px,
		rgba(128, 128, 128, 0.5) 0px 16px 2px -5px,
		rgba(128, 128, 128, 0.3) 5px 5px 5px 7px;
	}
</style>