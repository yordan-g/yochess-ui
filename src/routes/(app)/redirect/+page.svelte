<script lang="ts">
	import { afterNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { toNullableValue } from "$lib/utils.svelte";
	import type { AfterNavigate } from "@sveltejs/kit/src/exports/public";

	// Reading from the URL, SHOULD ONLY be used for the case where a user/2nd player is invited via custom link!
	let customGameIdInUrl = $derived<string | null>($page.url.searchParams.get("cg"));

	// Navigation State for Starting and Restarting Games determined by calls to the Svelte client-side navigation goto();
	let customGameId = $derived<string | null>(toNullableValue($page.state.customGameId));
	let rematchGameId = $derived<string | null>(toNullableValue($page.state.rematchGameId));
	let isCreator = $derived<string | null>(toNullableValue($page.state.isCreator));

	afterNavigate((navigation: AfterNavigate) => {
		// console.warn(`Redirect afterNavigate | from ${navigation.from?.url} to ${navigation.to?.url}, type ${navigation.type}`);

		// Simply loading '/redirect' should be forbidden!
		if (navigation.from === null && customGameIdInUrl === null) {
			goto(`/`, { replaceState: true, invalidateAll: true });
			return;
		}

		// When the 2nd player enters the site form a custom link
		if (customGameIdInUrl) {
			goto(`/play`, { replaceState: true, state: { customGameId: customGameIdInUrl } });
			return;
		}

		// When the 1st player creates custom game
		if (customGameId) {
			goto(`/play`, {
				replaceState: true,
				state: { customGameId: customGameId, isCreator: isCreator }
			});
			return;
		}

		// When both players pressed the rematch button
		if (rematchGameId) {
			goto(`/play`, { replaceState: true, state: { rematchGameId: rematchGameId }});
			return;
		}

		// When in the app load a normal game from the 'play' link
		goto(`/play`, { replaceState: true, state: {} });
		return;
	});
</script>

<p>r</p>
