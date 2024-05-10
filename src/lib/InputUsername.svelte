<script lang="ts">
	import { userService } from "$lib/userService";
	import { getGameState, sendMessage } from "$lib/webSocket.svelte";
	import { buildChangeNameMessage } from "$lib/utils.svelte";
	import type { GameState } from "$lib/types";

	let { color } = $props();
	const gameState: GameState = getGameState();

	let opponentUsername = $derived(gameState.config.opponentUsername);
	let username = userService.getUsername();
	let currentName = $state(username);
	let lastValidName = $state(username);

	function handleNameUpdate(event: Event) {
		let newName = (event.target as HTMLInputElement).value;
		if (newName.length < 3) {
			currentName = lastValidName;
		} else {
			userService.setUsername(newName);
			sendMessage(gameState.config.wsClient, buildChangeNameMessage(gameState.config.gameId, newName));
		}
	}

	function checkForEnter(event: KeyboardEvent) {
		if (event.key === "Enter") {
			(event.target as HTMLInputElement).blur();
		}
	}

	function saveName(event: Event) {
		lastValidName = (event.target as HTMLInputElement).value;
	}
</script>

<div class="username-c">
	{#if gameState.config.color !== color}
		<span>{opponentUsername}</span>
	{:else}
		<input type="text" id="playerName"
			   bind:value={currentName}
			   onkeydown={checkForEnter}
			   onblur={handleNameUpdate}
			   onclick={saveName}
			   maxlength="15"
		>
	{/if}
</div>

<style>
	.username-c {
		min-width: 80px;
		align-self: center;
	}

	span {
		width: 80px;
		font-size: clamp(var(--text-s), 1.5vw, var(--text-m));
	}

	input {
		width: 90%;
		min-width: 0;
		font-size: clamp(var(--text-s), 1.5vw, var(--text-m));
		outline: none;
		border: none;
		background: transparent;
	}

	input:focus {
		outline: none;
		border-bottom: 1px solid black;
	}

	input:hover {
		color: rgb(127, 153, 255);
		cursor: text;
	}

</style>
