<script lang="ts">
	import { userService } from "$lib/userService";
	import { getGameState, sendMessage } from "$lib/webSocket.svelte";
	import { buildChangeNameMessage } from "$lib/utils.svelte";

	let { color } = $props();
	const game = getGameState();

	let opponentUsername = $derived(game.state.game.opponentUsername);
	let username = userService.getUsername();
	let currentName = $state(username);
	let lastValidName = $state(username);

	function handleNameUpdate(event: Event) {
		let newName = (event.target as HTMLInputElement).value;
		if (newName.length < 3) {
			currentName = lastValidName;
		} else {
			userService.setUsername(newName);
			sendMessage(game.state.game.ws, buildChangeNameMessage(game.state.game.gameId, newName));
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
	{#if game.state.game.color !== color}
		<span>{opponentUsername}</span>
	{:else}
		<input type="text" id="playerName"
			   bind:value={currentName}
			   on:keydown={checkForEnter}
			   on:blur={handleNameUpdate}
			   on:click={saveName}
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