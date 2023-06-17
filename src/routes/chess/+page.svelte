<script>
    import Board from "$lib/Board.svelte";
    import Btn from "$lib/Btn.svelte";
    import {FEN} from "cm-chessboard/src/Chessboard.js";

    let board;
</script>

<div class="controls">
    <Btn on:click={()=> board.setPosition(FEN.start)} text={"Start Position"}></Btn>
    <Btn on:click={()=>"dsad"} text={"hello1ssssss"}></Btn>
    <Btn on:click={()=>"dsad"} text={"hello2"}></Btn>
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