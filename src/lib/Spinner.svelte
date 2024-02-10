<script lang="ts">

</script>

<div class="loading-c">
	<h2>Searching for a player</h2>
	<div class="spinner"></div>
</div>

<style>
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
</style>
