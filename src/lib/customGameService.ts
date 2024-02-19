import { nanoid } from "nanoid";
import { goto } from "$app/navigation";

export function createCustomGame() {
	let gameId = nanoid(8);

	goto(`/play`,
		{
			state: {
				isCreator: true,
				customGameId: gameId
			}
		}
	);
}
