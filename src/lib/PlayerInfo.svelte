<script lang="ts">
	import { getGameState, sendMessage } from "$lib/webSocket.svelte";
	import { buildTimeoutMessage, clockState, compareFn, formatToClock, piecesMap } from "$lib/utils.svelte";
	import InputUsername from "$lib/InputUsername.svelte";

	let { color } = $props();
	const game = getGameState();
	let captures = $derived(color === "w" ? game.state.lastMove.whiteCaptures : game.state.lastMove.blackCaptures);

	let clock = clockState();
	let timeLeft = $derived(color === "w" ? game.state.lastMove.timeLeft.white : game.state.lastMove.timeLeft.black);

	$effect(() => {
		if (clock.time === 0) {
			clock.stop();
			const winner = color === "w" ? "b" : "w";

			sendMessage(
				game.state.game.ws,
				buildTimeoutMessage(game.state.game.gameId, winner)
			);
		}
	});

	$effect(() => {
		if (game.endState.ended) {
			clock.stop();
		}
	});

	$effect(() => {
		if (color === game.turn) {
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
		<!--		<span>{username}</span>-->
		<InputUsername color="{color}" />
	</div>
	<div class="time-c">
		{#if color !== game.turn}
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
		display: grid;
		grid-template-columns: 200px 100px 2fr;
	}

	.user-c {
		display: flex;
		justify-content: start;
		align-items: center;
		column-gap: 10px;
	}

	.time-c {
		display: flex;
		/*justify-content: center;*/
		padding-left: 13px;
		align-items: center;
		font-family: Digital, Helvetica;
		font-size: 35px;
		border-radius: 15px;
		box-shadow: rgba(80, 80, 80, 0.6) inset 0px 7px 2px -3px,
		rgba(80, 80, 80, 0.6) inset 3px 10px 10px -3px;
	}

	.pieces-c {
		display: flex;
		justify-content: end;
		column-gap: 5px;
		align-items: center;
		font-size: x-large;
	}

	.user-c span {
		font-size: 18px;
	}

	.i-face {
		font-size: 40px !important;
	}

	i {
		color: #2c1252;
	}

	.material-symbols-outlined {
		font-variation-settings: 'FILL' 0,
		'wght' 200,
		'GRAD' 0,
		'opsz' 24
	}
</style>
