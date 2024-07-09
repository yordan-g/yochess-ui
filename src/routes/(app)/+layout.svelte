<script lang="ts">
	import "../../styles/global.css";
	import { page } from "$app/stores";
	import { createCustomGame } from "$lib/customGameService";

	let { children } = $props();
	let currentPath = $derived($page.url.pathname);

</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
		rel="stylesheet">
	<link rel="stylesheet"
		  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	<link rel="stylesheet"
		  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</svelte:head>

<div class="layout">
	<div class="nav-and-route">
		<nav class="nav">
			<a href="/" class="btn-nav {currentPath === '/' ? 'highlighted' : ''}">About</a>
			<a href="/play" class="btn-nav {currentPath === '/play' ? 'highlighted' : ''}">Play</a>
			<button class="custom-game btn-nav" onclick={createCustomGame}>Friendly Game</button>
		</nav>
		<div class="route-c">
			{@render children()}
		</div>
	</div>
	<footer class="footer">
		Yochess 2024
	</footer>
</div>


<style>
	.layout {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.nav-and-route {
		flex: 1;
		display: flex;
		flex-direction: row;
	}

	nav {
		flex: 0 0 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 30px;
		width: 220px;
		margin: 150px 0 0 0;
	}

	.route-c {
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative; /* Required for absolute positioning of pseudo-element */
	}

	.route-c::before {
		content: "";
		position: absolute;
		left: 0; /* Position the line on the left side; use 'right: 0;' for the right side */
		top: 0;
		bottom: 0;
		width: 3px; /* Thickness of the line */
		background: rgb(211, 211, 211); /* Color of the line */
		border-radius: 10px; /* Adjust as needed to create the oval edges */
	}

	footer {
		background: transparent;
		text-align: start;
	}

	.btn-nav {
		cursor: pointer;
		background: none;
		text-align: center;
		display: block;
		border: none;
		text-decoration: none;
		font-family: "Roboto", sans-serif;
		font-size: var(--text-xl);
		font-weight: 300;
		padding: 10px 20px;
		color: rgb(44, 18, 82);
		transition: color 0.3s ease;
		position: relative;
		z-index: 1;
	}

	.btn-nav:hover {
		color: white;
	}

	.btn-nav::before {
		position: absolute;
		content: "";
		top: -2px;
		right: -2px;
		bottom: -2px;
		left: -2px;
		background-image: var(--purple-gradien);
		background-clip: border-box;
		z-index: -2;
		transition: opacity 0.2s linear;
		opacity: 0;
		border-radius: 10px;
	}

	.btn-nav::after {
		position: absolute;
		content: "";
		z-index: -1;
		top: 1px;
		right: 1px;
		bottom: 1px;
		left: 1px;
		background-color: white;
		border-radius: 7px;
		opacity: 0;
	}

	.btn-nav:hover::before {
		opacity: 0.7;
	}

	.highlighted::before {
		opacity: 0.7;
	}

	.highlighted::after {
		opacity: 1;
	}

	.highlighted:hover::after {
		opacity: 0;
	}

	.custom-game {
		padding: 10px;
		margin: 0px 30px 0px 30px;
	}

	@media only screen and (max-width: 480px) {
		.layout {
			display: flex; width: 100%; height: 100%;
		}

		.nav-and-route {
			height: 100%;
			display: flex;
			flex-direction: column-reverse;
			flex-grow: 1;
		}

		.route-c {
			display: flex;
			margin: 0;
			padding: 0;
			flex: 5;
			position: unset;
			overflow-y: auto;
		}

		.route-c::before {
			display: none;
		}

		nav {
			flex: 1;
			display: flex;
			flex-direction: row;
			gap: 1em;
			width: unset;
			max-width: 100%;
			align-items: center;
			justify-content: space-between;
			margin: 0em 1.5em 0em 1.5em;
			flex-grow: 1;
		}
		nav > * {
			flex: 1;
		}

		.custom-game {
			padding: 0em;
			margin: 0em;
		}

		.btn-nav {
			padding: 0.2em 0.5em 0.2em 0.5em;
			font-size: 1.8em;
		}

		footer {
			display: none;
		}
	}

</style>
