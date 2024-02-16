<script lang="ts">
	import Spinner from "$lib/Spinner.svelte";
	import { onDestroy, onMount, setContext } from "svelte";
	import { connectToWebSocketServer, GAME_STATE_KEY, initGameState, sendMessage } from "$lib/webSocket.svelte";
	import Board from "$lib/Board.svelte";
	import PlayerInfo from "$lib/PlayerInfo.svelte";
	import EndDialog from "$lib/EndDialog.svelte";
	import { buildLeftGameMessage } from "$lib/utils.svelte";
	import { beforeNavigate, afterNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import { userService } from "$lib/userService";
	import type { GameState } from "$lib/types";
	import { fade } from "svelte/transition";

	let userId: string;
	let username: string;
	const gameState: GameState = initGameState();
	setContext(GAME_STATE_KEY, gameState);
	// $inspect(game.endState)

	onMount(() => {
		userId = userService.getUserId();
		username = userService.getUsername();
		connectToWebSocketServer(userId, gameState, username, null);
	});

	onDestroy(() => {
		console.log("onDestroy -- ")
		sendMessage(gameState.config.wsClient, buildLeftGameMessage(gameState.config.gameId));
		gameState.resetState();
		// setContext(GAME_STATE_KEY, null);
	});

	beforeNavigate(() => {
		sendMessage(gameState.config.wsClient, buildLeftGameMessage(gameState.config.gameId));
		gameState.resetState();
	});

	afterNavigate(() => {
		if ($page.url.searchParams.get("rematchGameId") != null) {
			connectToWebSocketServer(userId, gameState, username, $page.url.searchParams.get("rematchGameId"));
		}
	});

</script>

{#if gameState.config.isLoading}
	<Spinner />
{:else}
	<div class="play-c">
		<div class="game-c">
			<PlayerInfo color={gameState.config.color === "w" ? "b" : "w"} />
			<Board />
			<PlayerInfo color={gameState.config.color} />
			{#if gameState.endState.leftGame || gameState.endState.close}
				<div
					in:fade={{delay: 300, duration: 700 }}
					class="notification">
					<span class="red-t">Game ended, you can start another one!</span>
				</div>
			{/if}
		</div>
		<div class="chat-c"></div>
	</div>
	<EndDialog />
{/if}

<style>
	.play-c {
		flex: 1;
		display: flex;
		flex-direction: row;
	}

	.game-c {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin: 50px 25px 50px 100px;
		gap: 15px;

		width: min(60vw, 60vh);
		height: min(50vw, 50vh);

		min-width: 300px;
		min-height: 300px;
		max-width: 550px;
		max-height: 550px;
	}

	.chat-c {
		width: 250px;
		height: 560px;
		margin: 50px 0 0 0;

		border-radius: 10px;
		box-shadow: rgba(80, 80, 80, 0.6) inset 0px 7px 2px -3px,
		rgba(80, 80, 80, 0.6) inset 3px 10px 10px -3px;
	}
</style>
