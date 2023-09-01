<script>
    import "cm-chessboard/assets/chessboard.css";
    import "cm-chessboard/assets/extensions/markers/markers.css";
    import {BORDER_TYPE, Chessboard, FEN, INPUT_EVENT_TYPE} from "cm-chessboard/src/Chessboard.js";
    import {onDestroy, onMount} from "svelte";
    import {MARKER_TYPE, Markers} from "cm-chessboard/src/extensions/markers/Markers.js";
    import state, {connect, sendMessage} from "$lib/store.js";
    import {v4 as uuidv4} from "uuid";

    let board;
    let unsubscribe;

    onMount(() => {
        connect(uuidv4());

        board = new Chessboard(document.getElementById("containerId"), {
            position: FEN.start,
            assetsUrl: "../assets/",
            extensions: [{class: Markers}],
            style: {
                cssClass: "default",
                borderType: BORDER_TYPE.frame
            }
        });
        board.enableMoveInput(inputHandler)

        unsubscribe = state.subscribe(handleStateUpdate);
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
    });

    async function handleStateUpdate(state) {
        if (state.wsStage == "OPEN") {
            console.log("-- SET POSITION", state.game.color)
            await board.setOrientation(state.game.color)
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

    function inputHandler(event) {
        board.removeMarkers(MARKER_TYPE.frame)
        switch (event.type) {
            case INPUT_EVENT_TYPE.moveInputStarted:
                console.log(`moveInputStarted`);
                return true
            case INPUT_EVENT_TYPE.validateMoveInput:
                console.log(`validateMoveInput:`);
                sendMessage($state.ws, {
                    piece: event.chessboard.getPiece(event.squareFrom),
                    squareFrom: event.squareFrom,
                    squareTo: event.squareTo,
                });
                return true
            case INPUT_EVENT_TYPE.moveInputCanceled:
                console.log("moveInputCanceled")
                return false
            case INPUT_EVENT_TYPE.moveInputFinished:
                return true
        }
    }

</script>

<div class="board" id="containerId"></div>

<style>

    .board {
        width: 600px;
    }
</style>