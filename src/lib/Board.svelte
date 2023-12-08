<script lang="ts">
	import { fade } from "svelte/transition";
	import { initBoard } from "./webSocket.svelte";
	import { onMount } from "svelte";
	import "cm-chessboard/assets/chessboard.css";
	import "cm-chessboard/assets/extensions/markers/markers.css";
	import "cm-chessboard/assets/extensions/promotion-dialog/promotion-dialog.css";

	onMount(() => {
		initBoard();
	});

</script>

<div in:fade="{{ duration: 700 }}" class="board"
	 id="containerId">
</div>

<style>
	.board {
		width: 600px;
	}
</style>