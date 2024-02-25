<script lang="ts">
	import "../styles/global.css";
	import { page } from "$app/stores";
	import { createCustomGame } from "$lib/customGameService";
	import { onMount } from "svelte";

	let currentPath = $derived($page.url.pathname);

	onMount(() => {
		console.log("Layout onMount");
	});
</script>

<svelte:head>
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" rel="stylesheet">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</svelte:head>

<div class="layout">
	<div class="nav-and-route">
		<nav class="nav">
			<a href="/" class="btn-nav {currentPath === '/' ? 'highlighted' : ''}">About</a>
			<a href="/play" class="btn-nav {currentPath === '/play' ? 'highlighted' : ''}">Play</a>
			<button class="custom-game btn-nav" onclick={createCustomGame}>Friendly Game</button>
<!--			<a href="redirect" class="btn-nav {currentPath === '/redirect' ? 'highlighted' : ''}">Redirect</a>-->
		</nav>
		<div class="route-c">
			<slot></slot>
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
		width: 98vw;
		height: 98vh;
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
		font-family: "Helvetica Neue", sans-serif;
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
		background-image: linear-gradient(
			to left top,
			rgb(255, 0, 206),
			rgb(127, 153, 255)
		);
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

</style>
