<link rel="stylesheet" href="/css/global.css" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

<script lang="ts">
	import { page } from "$app/stores";
</script>

<div class="layout">
	<nav>
		<ul>
			<li>
				<a href="/" class="btn"
				   class:highlighted={$page.url.pathname === '/'}
				>Home
				</a>
				<a href="practice"
				   class="btn"
				   class:highlighted={$page.url.pathname === '/practice'}
				>Practice
				</a>
				<a href="play" class="btn"
				   data-sveltekit-reload
				   class:highlighted={$page.url.pathname === '/play'}
				>Play</a>
			</li>
		</ul>
	</nav>
	<slot></slot>
</div>


<style>
	@import "$lib/bulma-extention.sass";

	.layout {
		display: grid;
		grid-template-columns: 250px 1fr;
	}

	nav {
		margin-top: 100px;
		position: relative;
	}

	a {
		color: rgba(0, 0, 0, 85%);
	}

	nav::after {
		content: "";
		position: absolute;
		top: -200px;
		bottom: -200px;
		right: 0px;
		border-right: 3px solid #d3d3d3;
		border-radius: 10px;
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	li {
		display: flex;
		row-gap: 50px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	a {
		font-size: 40px;
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

</style>