<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { navigating, page } from "$app/stores";
	import { toNullableValue } from "$lib/utils.svelte";

	// Reading from the URL, SHOULD ONLY be used for the case where a user/2nd player is invited via custom link!
	let customGameIdInUrl = $derived<string | null>($page.url.searchParams.get("cg"));

	// Navigation State for Starting and Restarting Games determined by calls to the Svelte client-side navigation goto();
	let customGameId = $derived<string | null>(toNullableValue($page.state.customGameId));
	let rematchGameId = $derived<string | null>(toNullableValue($page.state.rematchGameId));
	let isCreator = $derived<string | null>(toNullableValue($page.state.isCreator));

	onMount(() => {
		console.log("Redirect onMount ");

		// Simply loading '/redirect' should be forbidden!
		if ($navigating == null && customGameIdInUrl == null) {
			goto(`/`, { replaceState: true, invalidateAll: true });
		}

		// When the 2nd player enters the site form a custom link
		if (customGameIdInUrl) {
			goto(`/play`, {
				replaceState: true,
				state: { customGameId: customGameIdInUrl }
			});
		}

		// When the 1st player creates custom game
		if (customGameId) {
			goto(`/play`, {
				replaceState: true,
				state: { customGameId: customGameId, isCreator: isCreator }
			});
		}

		// When both players pressed the rematch button
		if (rematchGameId) {
			goto(`/play`, {
				replaceState: true,
				state: { rematchGameId: rematchGameId }
			});
		}
	});
</script>

<h1>Redirect</h1>
