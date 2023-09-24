<script lang="ts">
    import { fade } from "svelte/transition";
    import { initBoard } from "$lib/webSocket";
    import type { Unsubscriber } from "svelte/store";
    import { onDestroy, onMount } from "svelte";
    import "cm-chessboard/assets/chessboard.css";
    import "cm-chessboard/assets/extensions/markers/markers.css";

    let unsubscribe: Unsubscriber;

    onMount(() => {
        unsubscribe = initBoard();
    });

    onDestroy(() => {
        if (unsubscribe) unsubscribe();
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