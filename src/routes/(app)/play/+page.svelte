<script lang="ts">
	import Spinner from "$lib/Spinner.svelte";
	import { setContext } from "svelte";
	import { connectToWebSocketServer, GAME_STATE_KEY, initGameState, sendMessage } from "$lib/webSocket.svelte";
	import Board from "$lib/Board.svelte";
	import PlayerInfo from "$lib/PlayerInfo.svelte";
	import EndDialog from "$lib/EndDialog.svelte";
	import { buildLeftGameMessage, toNullableValue } from "$lib/utils.svelte.js";
	import { beforeNavigate, afterNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { userService } from "$lib/userService";
	import type { GameState } from "$lib/types";
	import { fade } from "svelte/transition";
	import type { AfterNavigate } from "@sveltejs/kit/src/exports/public";
	import GameControls from "$lib/GameControls.svelte";
	import Chat from "$lib/Chat.svelte";

	let userId: string;
	let username: string;
	const gameState: GameState = initGameState();
	setContext(GAME_STATE_KEY, gameState);

	let rematchGameId = $derived<string | null>(toNullableValue($page.state.rematchGameId));
	let customGameId = $derived<string | null>(toNullableValue($page.state.customGameId));
	let isCreator = $derived<string | null>(toNullableValue($page.state.isCreator));

	let friendlyGameDisplayLink =
		$derived(`${$page.url.protocol}//${$page.url.host}/redirect?cg=${customGameId}`);

	async function copyToClipboard(event: MouseEvent) {
		await navigator.clipboard.writeText(friendlyGameDisplayLink);
	}

	beforeNavigate(() => {
		// console.log(`Play beforeNavigate -- | ${gameState.config.gameId}`);
		sendMessage(gameState.config.wsClient, buildLeftGameMessage(gameState.config.gameId));
		gameState.resetState();
	});

	afterNavigate((navigation: AfterNavigate) => {
		// console.warn(`Play afterNavigate | from ${navigation.from?.url} to ${navigation.to?.url}, type ${navigation.type}`);
		userId = userService.getUserId();
		username = userService.getUsername();

		// Guard clause against the fact that Sveltekit sometimes runs afterNavigate twice, both on navigating out and in of '/play'.
		// Since the code below inits the ws connection, we don't want 2 duplicate connections leading one of them to be stale.
		if (navigation.to?.url.pathname === "/play") {

			if (navigation.from === null || navigation.type === "enter") {
				goto(`/`, { replaceState: true, invalidateAll: true });
				return;
			}
			if (navigation.type === "goto" || navigation.type === "link") {

				// console.warn(`page state ${JSON.stringify($page.state)}`);
				if (rematchGameId) {
					return connectToWebSocketServer(userId, gameState, username, rematchGameId, null, null);
				}
				if (customGameId) {
					// console.log(`starting custom game, cId: ${customGameId}`);
					return connectToWebSocketServer(userId, gameState, username, null, customGameId, isCreator);
				}
				// normal random game
				return connectToWebSocketServer(userId, gameState, username, null, null, null);
			}
		}
	});
</script>

{#if gameState.config.isLoading}
	{#if customGameId}
		<div class="flink-c">
			<div>
				<p data-testid="friendly-game-link">{friendlyGameDisplayLink}</p>
			</div>
			<button onclick={copyToClipboard}>
				<span class="material-symbols-outlined">content_copy</span>
			</button>
		</div>
	{/if}
	<Spinner />
{:else}
	<div transition:fade={{duration: 700}} class="play-c" data-testid="play-container">
		<div class="game-c" data-testid="game-container">
			<PlayerInfo color={gameState.config.color === "w" ? "b" : "w"} />
			<Board />
			<PlayerInfo color={gameState.config.color} />
			<GameControls/>
			{#if gameState.endState.leftGame || gameState.endState.close}
				<div
					in:fade={{duration: 700 }}
					class="notification" data-testid="end-game-notification">
					<span class="red-t">Game ended, you can start another one!</span>
				</div>
			{/if}
		</div>
		<Chat/>
	</div>
{/if}
<EndDialog />

<style>
	.flink-c {
		display: flex;
		justify-content: space-between;
		max-height: 50px;
		border: 3px solid var(--grey-color);
		border-radius: 20px;
		margin: 100px 0px 0px 120px;
		max-width: 450px;
	}

	.flink-c > div > p {
		padding: 0px 0px 0px 20px;
		font-size: var(--text-m);
	}

	.flink-c > button {
		padding: 3px 10px 0px 10px;
		cursor: copy;
		outline: none;
		border: none;
		border-left: 3px solid var(--grey-color);
		background-color: transparent;
	}

	.flink-c > button:hover {
		background-color: var(--grey-color);
		border-radius: 0px 17px 17px 0px;
	}

	.flink-c > button:active {
		transform: scale(0.95);
		background-color: var(--green-color);
	}

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
		min-width: 300px;
		min-height: 300px;
		max-width: min(65vw, 65vh);
		max-height: 500px;
	}

	@media only screen and (max-width: 480px) {
		.flink-c {
			margin: 5em 1em 1em 1em;
		}

		.flink-c > div > p {
			padding: 0px 0px 0px 20px;
			font-size: 0.8em;
		}

		.play-c {
			display: flex;
			flex-direction: column;
			width: 100%;
		}

		.game-c {
			margin: 1em 0em 0em 0em;
			width: 100%;
			height: 100%;
		}

		.notification {
			margin: 0em 0em 0em 1em;
			/* renders the element at the top as if it's the first one */
			order: -1;
		}
	}
</style>
