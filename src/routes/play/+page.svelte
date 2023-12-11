<script lang="ts">
	import Spinner from "$lib/Spinner.svelte";
	import { onDestroy, onMount, setContext } from "svelte";
	import { v4 as uuidv4 } from "uuid";
	import { closeWsConnection, connectToWs, GAME_STATE_KEY, initGameState } from "$lib/webSocket.svelte";
	import Board from "$lib/Board.svelte";
	import PlayerInfo from "$lib/PlayerInfo.svelte";

	const game = initGameState();
	// sets it to the context API to be reused by other components
	setContext(GAME_STATE_KEY, game);

	onMount(() => {
		connectToWs(uuidv4(), game.state);
	});

	onDestroy(() => {
		closeWsConnection(game.state);
		setContext(GAME_STATE_KEY, null);
	});

</script>

<!--<div class="play-c">-->
<!--	<div class="game-c">-->
<!--		<PlayerInfo color={color == "w" ? "b" : "w"} />-->
<!--		<Board />-->
<!--		<PlayerInfo color={color} />-->
<!--	</div>-->
<!--	<div class="chat-c">-->
<!--	</div>-->
<!--</div>-->

{#if game.state.game.isLoading}
	<Spinner />
{:else}
	<div class="play-c">
		<div class="game-c">
			<PlayerInfo color={game.state.game.color === "w" ? "b" : "w"} />
			<Board />
			<PlayerInfo color={game.state.game.color} />
		</div>
		<div class="chat-c">
		</div>
	</div>
{/if}

<style>
	.play-c {
		display: grid;
		grid-template-columns: 5fr 300px;
		justify-self: center;
		margin-top: 50px;
		gap: 20px;
	}

	.game-c {
		display: grid;
		grid-template-rows: 50px 1fr 50px;
		gap: 10px;
	}

	.chat-c {
		border: 1px solid black;
	}
</style>