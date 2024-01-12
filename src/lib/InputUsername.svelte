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

<div>
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
	span {
		font-size: 18px;
	}

	input {
		max-width: 130px;
		font-size: 18px;
		outline: none;
		border: none;
		background: transparent;
	}

	input:focus {
		outline: none;
		border-bottom: 1px solid black;
	}

	input:hover {
		color: #7f99ff;
		cursor: text;
	}

</style>