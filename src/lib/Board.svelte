<script>
    import "cm-chessboard/assets/chessboard.css";
    import "cm-chessboard/assets/extensions/markers/markers.css";
    import {Chessboard, FEN, INPUT_EVENT_TYPE} from "cm-chessboard/src/Chessboard.js";
    import {onMount} from "svelte";
    import {MARKER_TYPE, Markers} from "cm-chessboard/src/extensions/markers/Markers.js";

    let board;

    onMount(async () => {
        board = new Chessboard(document.getElementById("containerId"), {
            position: FEN.start,
            assetsUrl: "../assets/",
            extensions: [{class: Markers}]
        })

        board.enableMoveInput(inputHandler)
    });

    function inputHandler(event) {
        // console.log(event)
        board.removeMarkers(MARKER_TYPE.frame)
        switch (event.type) {
            case INPUT_EVENT_TYPE.moveInputStarted:
                // log(`moveInputStarted: ${event.square}`)
                return true
            case INPUT_EVENT_TYPE.validateMoveInput:
                // log(`validateMoveInput: ${event.squareFrom}-${event.squareTo}`)q
                return true
            case INPUT_EVENT_TYPE.moveInputCanceled:
            // log(`moveInputCanceled`)
        }
    }

</script>

<div class="board" id="containerId"></div>

<style>

    .board {
        width: 600px;
    }
</style>