<script lang="ts">
	import { getGameState, sendMessage } from "$lib/webSocket.svelte";
	import { buildTimeoutMessage, initClockState, compareFn, formatToClock, piecesMap } from "$lib/utils.svelte";
	import InputUsername from "$lib/InputUsername.svelte";
	import type { GameState } from "$lib/types";

	let { color } = $props();
	const gameState: GameState = getGameState();
	let captures = $derived(color === "w" ? gameState.lastMove.whiteCaptures : gameState.lastMove.blackCaptures);

	let clockState = initClockState();
	let timeLeft = $derived(color === "w" ? gameState.lastMove.timeLeft.white : gameState.lastMove.timeLeft.black);

	$effect(() => {
		if (clockState.time === 0) {
			clockState.stop();
			const winner = color === "w" ? "b" : "w";

			sendMessage(
				gameState.config.wsClient,
				buildTimeoutMessage(gameState.config.gameId, winner)
			);
		}
	});

	$effect(() => {
		if (gameState.endState.ended) {
			clockState.stop();
		}
	});

	$effect(() => {
		if (color === gameState.turn) {
			clockState.start(timeLeft);
		} else {
			clockState.stop();
		}

		return () => {
			clockState.stop();
		};
	});
</script>

<div class="player-info" data-testid="player-info-container">
	<div class="player-name" data-testid="player-name">
		<span class="material-symbols-outlined i-face">face_6</span>
		<InputUsername color="{color}" />
	</div>
	<div class="time-c" data-testid="time-left">
		{#if color !== gameState.turn}
			<span>{formatToClock(timeLeft)}</span>
		{:else}
			<span>{formatToClock(clockState.time)}</span>
		{/if}
	</div>
	<div class="pieces-c" data-testid="pieces-taken">
		{#each captures.toSorted(compareFn) as piece}
			<span>{@html piecesMap.get(piece)}</span>
		{/each}
	</div>
</div>


<style>
	.player-info {
		flex: 1;
		display: flex;
		flex-direction: row;
		max-height: 45px;
		justify-content: flex-start;
	}

	.player-name {
		flex: 2;
		display: flex;
		flex-direction: row;
		column-gap: 10px;
	}

	.time-c {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 80px;
		font-family: Digital, Roboto;
		font-size: clamp(var(--text-l), 2.5vw, var(--text-xl));
		border-radius: 15px;
		box-shadow: rgba(80, 80, 80, 0.6) inset 0px 7px 2px -3px,
		rgba(80, 80, 80, 0.6) inset 3px 10px 10px -3px;
	}

	.pieces-c {
		flex: 2.5;
		display: flex;
		justify-content: end;
		align-items: center;
		font-size: clamp(var(--text-s), 2vw, var(--text-l));
	}

	.i-face {
		font-size: clamp(var(--text-xl), 3.5vw, var(--text-xxl)) !important;
	}

	.material-symbols-outlined {
		font-variation-settings: 'FILL' 0,
		'wght' 200,
		'GRAD' 0,
		'opsz' 24
	}

	@media only screen and (max-width: 480px) {
		.player-info {
			max-width: 100%;
			margin: 0em 1em 0em 1em;
		}

		.pieces-c {
			flex-wrap: wrap;
			font-size: 0.8em;
			margin: 0em 0em 0em 1.5em;
		}

		.i-face {
			font-size: 2em !important;
		}

		.material-symbols-outlined {
			font-variation-settings: 'FILL' 0,
			'wght' 100,
			'GRAD' 0,
			'opsz' 24
		}
	}
</style>
