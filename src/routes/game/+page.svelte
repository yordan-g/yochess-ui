<script>
    import {onMount} from "svelte";
    import state, { connect, sendMessage } from '$lib/store';
    import Btn from "$lib/Btn.svelte";
    import Board from "$lib/Board.svelte";

    let board;

    onMount(async () => {
            await connect("yordan");
        }
    );
</script>


<Board bind:board/>

<Btn classes="bd" on:click={sendMessage} text={"send"}>
</Btn>
<p>
    {$state.id}
    {JSON.stringify($state.game)}
    {$state.game.message}
</p>

<style>
</style>