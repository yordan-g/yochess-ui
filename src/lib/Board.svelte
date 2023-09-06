<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import state, { connect, sendMessage } from "$lib/store";
  import type { Unsubscriber } from "svelte/store";
  import { v4 as uuidv4 } from "uuid";
  import "cm-chessboard/assets/chessboard.css";
  import "cm-chessboard/assets/extensions/markers/markers.css";
  import { BORDER_TYPE, Chessboard, FEN, INPUT_EVENT_TYPE } from "cm-chessboard/src/Chessboard.js";
  import { MARKER_TYPE, Markers } from "cm-chessboard/src/extensions/markers/Markers.js";
  import type { VisualMoveInput } from "cm-chessboard/src/view/VisualMoveInput";
  import type { GameState } from "$lib/store";

  let board: Chessboard;
  let unsubscribe: Unsubscriber | null = null;

  onMount(() => {
    connect(uuidv4());

    board = new Chessboard(document.getElementById("containerId"), {
      position: FEN.start,
      assetsUrl: "../assets/",
      extensions: [{ class: Markers }],
      style: {
        cssClass: "default",
        borderType: BORDER_TYPE.frame
      }
    });
    board.enableMoveInput(inputHandler);

    unsubscribe = state.subscribe(handleStateUpdate);
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  });

  async function handleStateUpdate(state: GameState) {
    if (state.wsStage == "OPEN") {
      console.log("-- SET POSITION", state.game.color);
      await board.setOrientation(state.game.color);
      return;
    }

    switch (state.lastMove.valid) {
      case true: {
        console.log(`Moving ${state.lastMove.squareFrom} - ${state.lastMove.squareTo}`, state);
        await board.movePiece(state.lastMove.squareFrom, state.lastMove.squareTo);
        break;
      }
      default: {
        console.log(`Moving ${state.lastMove.squareTo} - ${state.lastMove.squareFrom}`, state);
        await board.movePiece(state.lastMove.squareTo, state.lastMove.squareFrom);
        break;
      }
    }
  }

  function inputHandler(event: VisualMoveInput): boolean {
    board.removeMarkers(MARKER_TYPE.frame);
    switch (event.type) {
      case INPUT_EVENT_TYPE.moveInputStarted:
        console.log(`moveInputStarted`);
        return true;
      case INPUT_EVENT_TYPE.validateMoveInput:
        console.log(`validateMoveInput:`);
        sendMessage($state.ws, {
          piece: event.chessboard.getPiece(event.squareFrom),
          squareFrom: event.squareFrom,
          squareTo: event.squareTo,
          valid: true
        });
        return true;
      case INPUT_EVENT_TYPE.moveInputCanceled:
        console.log("moveInputCanceled");
        return false;
      case INPUT_EVENT_TYPE.moveInputFinished:
        return true;
      default: {
        return false;
      }
    }
  }

</script>

<div class="board" id="containerId"></div>

<style>

    .board {
        width: 600px;
    }
</style>