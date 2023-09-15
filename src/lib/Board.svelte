<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { state, closeWsConnection, connectToWs, handleStateUpdate, initBoard } from "$lib/store";
  import type { Unsubscriber } from "svelte/store";
  import { v4 as uuidv4 } from "uuid";
  import "cm-chessboard/assets/chessboard.css";
  import "cm-chessboard/assets/extensions/markers/markers.css";

  let unsubscribe: Unsubscriber;

  onMount(() => {
    connectToWs(uuidv4());
    initBoard();
    unsubscribe = state.subscribe(handleStateUpdate);
  });

  onDestroy(() => {
    closeWsConnection();
    if (unsubscribe) unsubscribe();
  });

</script>

<div class="board" id="containerId"></div>

<style>

    .board {
        width: 600px;
    }
</style>