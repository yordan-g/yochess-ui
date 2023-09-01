<script>
    import state, {reset} from '$lib/store';
    import Btn from "$lib/Btn.svelte";
    import Board from "$lib/Board.svelte";

</script>

<Board/>

<Btn classes="bd" on:click={() => reset($state.ws)} text={"send"}>
</Btn>