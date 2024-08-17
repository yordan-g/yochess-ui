import { v4 as uuidv4 } from "uuid";
import Chance from "chance";

export const userService = {
	getUserId: (): string => {
		let userId = localStorage.getItem("userId");

		if (!userId) {
			userId = uuidv4();
			localStorage.setItem("userId", userId);
		}

		return userId;
	},

	setUserId: (userId: string): void => {
		localStorage.setItem("userId", userId);
	},

	getUsername: (): string => {
		let username = localStorage.getItem("username");
		const chance = new Chance();

		if (!username) {
			chance.name();
			username = chance.name();
			localStorage.setItem("username", username);
		}

		return username;
	},

	setUsername: (username: string): void => {
		localStorage.setItem("username", username);
	}
};

