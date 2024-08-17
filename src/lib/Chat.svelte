<script lang="ts">
	import { MessageType } from "$lib/types";
	import { getGameState, sendMessage } from "$lib/webSocket.svelte";
	import { getCurrentTimeHHMM } from "$lib/utils.svelte";

	let gameState = getGameState();
	let chatInput = $state("");

	function handleInput(event: Event) {
		chatInput = (event.target as HTMLTextAreaElement).value;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault(); // Prevent adding a new line
			if (chatInput !== "") {
				sendMessage(
					gameState.config.wsClient,
					{
						kind: MessageType.CHAT_ENTRIES,
						gameId: gameState.config.gameId!!,
						entries: [{ username: gameState.config.username!!, timestamp: getCurrentTimeHHMM(), text: chatInput.trim() }]
					}
				);
				chatInput = "";
			}
		}
	}

	function isOpponentMessage(username: string): boolean {
		return !gameState.config.usernameHistory.includes(username);
	}
</script>
<div id="chat-c" data-testid="chat-container">
	<div id="messages-c">
		{#each gameState.chatState.slice().reverse() as message}
			<div class="message-entry">
				<p class="message-name-time {isOpponentMessage(message.username) && 'op-align-self'}">
					<span>{message.username}</span> <span>{message.timestamp}</span>
				</p>
				<p class="message-text {isOpponentMessage(message.username) && 'op-align-self op-bg-color'}">
					{message.text}
				</p>
			</div>
		{/each}
	</div>
	<div id="chat-input-c">
		<textarea
			id="chat-input" placeholder="Chat to your opponent..."
			bind:value={chatInput}
			oninput={handleInput}
			onkeydown={handleKeydown}
		></textarea>
	</div>
</div>
<style>
	#chat-c {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 25%;
		min-width: 13rem;
		max-width: 20rem;
		height: 80%;
		max-height: min(80vh, 80vw);
		margin: 50px 0 0 0;
	}

	#messages-c {
		flex: 5;
		display: flex;
		flex-direction: column-reverse;
		overflow-y: auto;
		border-radius: 10px;
		box-shadow: rgba(80, 80, 80, 0.6) inset 0px 7px 2px -3px,
		rgba(80, 80, 80, 0.6) inset 3px 10px 10px -3px;
	}

	#chat-input-c {
		flex: 1;
		border-radius: 10px;
		box-shadow: rgba(80, 80, 80, 0.6) inset 0px 7px 2px -3px,
		rgba(80, 80, 80, 0.6) inset 3px 10px 10px -3px;
	}

	#chat-input {
		/*flex: 1;*/
		--buffer: 0.7rem;
		width: calc(100% - 4*var(--buffer));
		height: calc(100% - 4*var(--buffer));

		/* defaults override */
		margin: var(--buffer);
		padding: var(--buffer);
		border: none;
		border-radius: 7px;
		outline: none;
		background: var(--purple-gradien-05);
		box-shadow: none;
		resize: none;
		font: inherit;
		color: black;
	}

	.message-entry {
		display: flex;
		align-items: flex-end;
		flex-direction: column;
		margin: 0.1rem 1rem 1rem 1rem;
	}

	.message-name-time {
		font-size: 0.7rem;
		margin: 0 0 0.3rem 0;
	}

	.message-text {
		/*display: inline-block;*/
		margin: 0;
		padding: 0.5rem;
		background: var(--purple-gradien-05);
		border-radius: 10px;

		overflow-wrap: break-word;
		white-space: pre-wrap;
	}

	.op-align-self {
		align-self: flex-start;
	}

	.op-bg-color {
		background: rgba(192, 192, 192, 0.5);
	}

	@media only screen and (max-width: 480px) {
		#chat-c {
			display: none;
		}
	}
</style>
