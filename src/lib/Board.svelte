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

		box-shadow: rgba(128, 128, 128, 0.8) 0px 3px 3px -2px,
		rgba(128, 128, 128, 0.5) 0px 6px 2px -4px,
		rgba(128, 128, 128, 0.3) 0px 9px 2px -6px,
		rgba(128, 128, 128, 0.2) 1px 3px 3px 2px,
		rgba(128, 128, 128, 0.1) 2px 3px 3px 5px;
	}
</style>