<script lang="ts">
    import Board from "$lib/Board.svelte";
    import Btn from "$lib/Btn.svelte";
    import { Chessboard, FEN } from "cm-chessboard/src/Chessboard.js";

    let board: Chessboard;

    function printPosition() {
        console.log(board.getPosition())
    }
</script>

<div class="controls">
    <Btn classes="bd" on:click={()=> board.setPosition(FEN.start, true)} text={"Start Position"}></Btn>
    <Btn classes="bd" on:click={printPosition} text={"Get Position"}></Btn>
    <Btn classes="bd" on:click={()=>"dsad"} text={"hello2"}></Btn>
</div>
<Board bind:board/>

<style>
    .controls {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: fit-content;
    }
</style>