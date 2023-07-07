<script>
    import "cm-chessboard/assets/chessboard.css";
    import "cm-chessboard/assets/extensions/markers/markers.css";
    import {BORDER_TYPE, Chessboard, FEN, INPUT_EVENT_TYPE} from "cm-chessboard/src/Chessboard.js";
    import {onMount} from "svelte";
    import {MARKER_TYPE, Markers} from "cm-chessboard/src/extensions/markers/Markers.js";

    export let board;

    onMount(async () => {
        board = new Chessboard(document.getElementById("containerId"), {
            position: FEN.start,
            assetsUrl: "../assets/",
            extensions: [{class: Markers}],
            style: {
                cssClass: "default",
                borderType: BORDER_TYPE.frame
            }
        })

        board.enableMoveInput(inputHandler)
    });

    function inputHandler(event) {
        // console.log(event)
        board.removeMarkers(MARKER_TYPE.frame)
        switch (event.type) {
            case INPUT_EVENT_TYPE.moveInputStarted:
                console.log(`move started`)
                let piece = event.chessboard.getPiece(event.squareFrom)
                console.log(piece)
                return true
            case INPUT_EVENT_TYPE.validateMoveInput:
                console.log(`validateMoveInput: ${event.squareFrom}-${event.squareTo}`)
                return true
            case INPUT_EVENT_TYPE.moveInputCanceled:
                console.log(`invalid move`)
                return true
            case INPUT_EVENT_TYPE.moveInputFinished:
                {
                    // console.log(board.getPosition())
                    console.log(event)
                    // let piece = event.chessboard.getPiece(event.squareTo)
                    // console.log(piece)

                    return true
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