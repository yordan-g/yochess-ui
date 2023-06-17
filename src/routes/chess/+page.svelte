<script>
    import Board from "$lib/Board.svelte";
    import Btn from "$lib/Btn.svelte";
</script>

<div class="controls">
    <Btn on:click={()=>"dsad"} text={"Start Position"}></Btn>
    <Btn on:click={()=>"dsad"} text={"hello1ssssss"}></Btn>
    <Btn on:click={()=>"dsad"} text={"hello2"}></Btn>
</div>
<Board/>

<style>

    .controls {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: fit-content;
    }
</style>