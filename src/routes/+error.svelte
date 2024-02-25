<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	onMount(() => {
		goto(`/`, { replaceState: true, invalidateAll: true });
	});

</script>

<div>
	<h1>404 Page Not Found</h1>
</div>

<style>

	div {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
