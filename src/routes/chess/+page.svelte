<script>
    import "cm-chessboard/assets/chessboard.css";
    import {Chessboard} from "cm-chessboard/src/Chessboard.js";
    import {onMount} from "svelte";

    onMount(async () => {
        new Chessboard(document.getElementById("containerId"),
            {position: "rn2k1r1/ppp1pp1p/3p2p1/5bn1/P7/2N2B2/1PPPPP2/2BNK1RR"})
    });
</script>

<div class="board" id="containerId"></div>

<style>

    .board {
        width: 600px;
        justify-self: center;
    }
</style>