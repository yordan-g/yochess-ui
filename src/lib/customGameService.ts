import { nanoid } from "nanoid";
import { goto } from "$app/navigation";

export function createCustomGame() {
	let gameId = nanoid(8);

	goto("/redirect", {
		replaceState: true,
		state: {
			customGameId: gameId,
			isCreator: "true"
		}
	});
}
