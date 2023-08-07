<script>
    import {onDestroy, onMount} from "svelte";
    import state, { connect, reset } from '$lib/store';
    import Btn from "$lib/Btn.svelte";
    import Board from "$lib/Board.svelte";
    import { v4 as uuidv4 } from 'uuid';

    let board;
    let unsubscribe;

    function handleStateUpdate(state) {
        if (state.wsStage == "OPEN") {
            console.log("-- SET POSITION", state.game.color)
            board.setOrientation(state.game.color)
            return;
        }

        switch (state.lastMove.valid) {
            case true: {
                console.log(`Moving ${state.lastMove.squareFrom} - ${state.lastMove.squareTo}`, state);
                board.movePiece(state.lastMove.squareFrom, state.lastMove.squareTo);
                break;
            }
            default: {
                console.log(`Moving ${state.lastMove.squareTo} - ${state.lastMove.squareFrom}`, state);
                board.movePiece(state.lastMove.squareTo, state.lastMove.squareFrom);
                break;
            }
        }
    }

    onMount(async () => {
            await connect(uuidv4());
            unsubscribe = state.subscribe(handleStateUpdate);
        }
    );

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
    });

</script>


<Board bind:board/>

<Btn classes="bd" on:click={reset} text={"send"}>
</Btn>

<style>
</style>