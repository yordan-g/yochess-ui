<link rel="stylesheet" href="/css/global.css" />
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" rel="stylesheet">

<script>
</script>

<div class="layout">
	<nav>
		<ul>
			<li>
				<a class="btn" href="/">Home</a>
				<a class="btn" href="practice">Practice</a>
				<a class="btn" href="play">Play</a>
			</li>
		</ul>
	</nav>
	<slot></slot>
</div>


<style>
	.layout {
		display: grid;
		grid-template-columns: 250px 1fr;
	}

	nav {
		margin-top: 100px;
		position: relative;
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
</style>