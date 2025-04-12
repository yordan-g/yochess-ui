import { goto } from "$app/navigation";

export function createCustomGame() {
	let gameId = crypto.randomUUID();

	goto("/redirect", {
		replaceState: true,
		state: {
			customGameId: gameId,
			isCreator: "true"
		}
	});
}
