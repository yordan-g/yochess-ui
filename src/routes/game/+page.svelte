<script>
    import {onMount} from "svelte";
    import state, { connect, sendMessage } from '$lib/store';
    import Btn from "$lib/Btn.svelte";

    onMount(async () => {
            await connect("yordan");

        }
    );
</script>

<Btn classes="bd" on:click={sendMessage} text={"send"}>
</Btn>
<p>
    {$state.id}
    {$state.message}
</p>

<style>
</style>