<script lang="ts">
	import { getGameState, sendMessage } from "$lib/webSocket.svelte";
	import { buildTimeoutMessage, clockState, compareFn, formatToClock, piecesMap } from "$lib/utils.svelte";
	import InputUsername from "$lib/InputUsername.svelte";
	import type { GameState } from "$lib/types";

	let { color } = $props();
	const gameState: GameState = getGameState();
	let captures = $derived(color === "w" ? gameState.lastMove.whiteCaptures : gameState.lastMove.blackCaptures);

	let clock = clockState();
	let timeLeft = $derived(color === "w" ? gameState.lastMove.timeLeft.white : gameState.lastMove.timeLeft.black);

	$effect(() => {
		if (clock.time === 0) {
			clock.stop();
			const winner = color === "w" ? "b" : "w";

			sendMessage(
				gameState.config.wsClient,
				buildTimeoutMessage(gameState.config.gameId, winner)
			);
		}
	});

	$effect(() => {
		if (gameState.endState.ended) {
			clock.stop();
		}
	});

	$effect(() => {
		if (color === gameState.turn) {
			clock.start(timeLeft);
		} else {
			clock.stop();
		}

		return () => {
			clock.stop();
		};
	});
</script>

<div class="player-info">
	<div class="user-c">
		<span class="material-symbols-outlined i-face">face_6</span>
		<InputUsername color="{color}" />
	</div>
	<div class="time-c">
		{#if color !== gameState.turn}
			<span>{formatToClock(timeLeft)}</span>
		{:else}
			<span>{formatToClock(clock.time)}</span>
		{/if}
	</div>
	<div class="pieces-c">
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

	.user-c {
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
		font-family: Digital, Helvetica;
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

	i {
		color: rgb(44, 18, 82);
	}

	.material-symbols-outlined {
		font-variation-settings: 'FILL' 0,
		'wght' 200,
		'GRAD' 0,
		'opsz' 24
	}
</style>
