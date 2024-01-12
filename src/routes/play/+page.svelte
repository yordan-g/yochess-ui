<script lang="ts">
	import Spinner from "$lib/Spinner.svelte";
	import { onDestroy, onMount, setContext } from "svelte";
	import { connectToWs, GAME_STATE_KEY, initGameState, sendMessage } from "$lib/webSocket.svelte";
	import Board from "$lib/Board.svelte";
	import PlayerInfo from "$lib/PlayerInfo.svelte";
	import EndDialog from "$lib/EndDialog.svelte";
	import { buildLeftGameMessage } from "$lib/utils.svelte";
	import { beforeNavigate, afterNavigate } from "$app/navigation";
	import { page } from '$app/stores';
	import { userService } from "$lib/userService";

	let userId: string;
	let username: string;
	const game = initGameState();
	setContext(GAME_STATE_KEY, game);

	onMount(() => {
		userId = userService.getUserId();
		username = userService.getUsername();
		connectToWs(userId, game, username, null);
	});

	onDestroy(() => {
		console.log("onDestroy -- ")
		sendMessage(game.state.game.ws, buildLeftGameMessage(game.state.game.gameId));
		game.resetState();
		// setContext(GAME_STATE_KEY, null);
	});

	beforeNavigate(() => {
		sendMessage(game.state.game.ws, buildLeftGameMessage(game.state.game.gameId));
		game.resetState();
	});

	afterNavigate(() => {
		if ($page.url.searchParams.get("rematchGameId") != null) {
			connectToWs(userId, game, username, $page.url.searchParams.get("rematchGameId"));
		}
	});

</script>

{#if game.state.game.isLoading}
	<Spinner />
{:else}
	<div class="play-c">
		<div class="game-c">
			<PlayerInfo color={game.state.game.color === "w" ? "b" : "w"} />
			<Board />
			<PlayerInfo color={game.state.game.color} />
			{#if game.endState.leftGame || game.endState.close}
				<div class="notification">
					<span>Game ended, you can start another one!</span>
				</div>
			{/if}
		</div>
		<div class="chat-c">
		</div>
	</div>
	<EndDialog />
	<!--	<button on:click={() => (game.endState.ended = true)}> show modal</button>-->
	<!--	<button on:click={() => (game.endState.ended = false)}> show modal false</button>-->
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
		grid-template-rows: 50px 1fr 50px auto;
		gap: 10px;
		max-width: 600px;
	}

	.chat-c {
		border-radius: 10px;

		box-shadow: rgba(80, 80, 80, 0.6) inset 0px 7px 2px -3px,
		rgba(80, 80, 80, 0.6) inset 3px 10px 10px -3px;
	}

	.notification > span {
		color: rgba(255, 100, 100, 1)
	}
</style>
