<script lang="ts">
	import { getGameState, initBoard } from "./webSocket.svelte";
	import { onMount } from "svelte";
	import "cm-chessboard/assets/chessboard.css";
	import "cm-chessboard/assets/extensions/markers/markers.css";
	import "cm-chessboard/assets/extensions/promotion-dialog/promotion-dialog.css";
	import type { GameState } from "$lib/types";

	const game: GameState = getGameState();

	onMount(() => {
		initBoard(game.config, game.lastMove);
	});

</script>

<div class="board" data-testid="chessboard"
	 id="containerId">
</div>

<style>
	.board {
		flex: 1;
		display: flex;
	}
</style>
