<script lang="ts">
	import { fade } from "svelte/transition";
	import { toNullableValue } from "$lib/utils.svelte";
	import { page } from "$app/stores";

	let customGameId = $derived<string | null>(toNullableValue($page.state.customGameId));

</script>

<div class="loading-c" in:fade={{delay:100, duration: 700}}>
	{#if customGameId}
		<p>Send the link to you friend. Waiting for him to connect...</p>
	{:else}
		<p class="r-game-text">Searching for opponent...</p>
	{/if}
	<div class="spinner" data-testid="waiting-for-game-spinner"></div>
</div>

<style>
	p {
		font-size: var(--text-l);
		max-width: 350px;
	}

	.loading-c {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		margin: 100px 0px 0px 100px;
		width: 500px;
	}

	.spinner {
		border: 10px solid rgba(175, 175, 175, 30%);
		border-radius: 50%;
		border-top: 10px solid rgba(255, 0, 181);
		width: 100px;
		height: 100px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@media only screen and (max-width: 480px) {
		.loading-c {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 20px;
			margin: 0;
			width: 100%;
		}

		p {
			text-align: center;
		}

		.r-game-text {
			margin: 5em 0 0 0;
		}
	}
</style>
