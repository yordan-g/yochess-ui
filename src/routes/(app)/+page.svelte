<script lang="ts">
</script>

<div class="about">
	<h1 class="gr-text">Let's play a quick game of chess!</h1>
	<p>A simple website for playing chess which doesn't require account creation.
		Slowly I will try my best to add more features but don't get your hopes too high.
		If you like the project and want to give me any feedback or just chat about it,
		<a href="https://www.instagram.com/jordangganev" target="_blank">you can find me on instagram.</a>
	</p>
	<h2 class="gr-text">How to play</h2>
	<p>Start a random game from the <span class="gr-text"><strong>Play</strong></span> button.</p>
	<p>Invite a fiend to a custom game from the <span class="gr-text"><strong>Friendly Game</strong></span> button.</p>

	<h2 class="gr-text">More about me and the project</h2>
	<p>I am a software developer based in Sofia, Bulgaria. Being the ultimate average hobby chess player, this project
		exists mainly for me to learn and explore new web programming technologies. If you interested in the technical
		details of the project, you can <a href="https://github.com/yordan-g/yochess-ui" target="_blank">read more
			here.</a>
	</p>
</div>

<style>
	.about {
		display: flex;
		flex-direction: column;
		margin: 100px 0 100px 150px;
		max-width: 500px;
		max-height: 98vh;
		text-align: justify;
	}

	a {
		color: darkorchid;
	}

	h1 {
		text-align: center;
		font-weight: normal;
	}

	h2 {
		font-weight: normal;
		text-align: start;
	}

	@media only screen and (max-width: 480px) {
		.about {
			display: flex;
			margin: 3em 1.5em 0em 1.5em;
			max-width: 100%;
			max-height: 100%;
		}

		h1, h2 {
			margin: 0em 0em 0.5em 0em;
		}

		p {
			margin: 0em 0em 1em 0em;
		}
	}
</style>
