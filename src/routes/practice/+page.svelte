<script lang="ts">
  import Btn from "$lib/Btn.svelte";
  import { BORDER_TYPE, FEN, INPUT_EVENT_TYPE } from "cm-chessboard/src/Chessboard.js";
  import { onMount } from "svelte";
  import { MARKER_TYPE, Markers } from "cm-chessboard/src/extensions/markers/Markers.js";
  import type { VisualMoveInput } from "cm-chessboard/src/view/VisualMoveInput";
  import { Chessboard } from "cm-chessboard/src/Chessboard";

  let board: Chessboard;

  function printPosition() {
    console.log(board.getPosition());
  }

  onMount(() => {
    board = new Chessboard(document.getElementById("containerId"), {
      position: FEN.start,
      assetsUrl: "../assets/",
      extensions: [{ class: Markers }],
      style: {
        cssClass: "default",
        borderType: BORDER_TYPE.frame
      }
    });
    board.enableMoveInput((event: VisualMoveInput): boolean => {
      board.removeMarkers(MARKER_TYPE.frame);
      switch (event.type) {
        case INPUT_EVENT_TYPE.moveInputStarted:
          // console.log(`moveInputStarted: ${event.squareFrom}`)
          return true
        case INPUT_EVENT_TYPE.validateMoveInput:
          // console.log(`validateMoveInput: ${event.squareFrom}-${event.squareTo}`)
          return true
        case INPUT_EVENT_TYPE.moveInputCanceled:
          // console.log(`moveInputCanceled`)
        default: return true
      }
    })
  });

</script>

<div class="controls">
  <Btn classes="bd" on:click={()=> board.setPosition(FEN.start, true)} text={"Start Position"}></Btn>
  <Btn classes="bd" on:click={printPosition} text={"Get Position"}></Btn>
  <Btn classes="bd" on:click={()=>"dsad"} text={"hello2"}></Btn>
</div>

<div class="board" id="containerId"></div>

<style>
    .board {
        width: 600px;
    }

    .controls {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: fit-content;
    }
</style>