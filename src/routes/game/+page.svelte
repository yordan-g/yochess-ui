<script>
    import {onDestroy, onMount} from "svelte";
    import state, { connect, sendMessage } from '$lib/store';
    import Btn from "$lib/Btn.svelte";
    import Board from "$lib/Board.svelte";

    let board;
    let unsubscribe;

    function handleStateUpdate(state) {
        console.log('State updated:', state);

        // board.movePiece(state.lastMove.squareFrom, state.lastMove.squareTo)
        board.movePiece(state.lastMove.squareTo, state.lastMove.squareFrom)
    }

    onMount(async () => {
            await connect("yordan");
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

<Btn classes="bd" on:click={sendMessage} text={"send"}>
</Btn>

<style>
</style>