import { v4 as uuidv4 } from "uuid";

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

		if (!username) {
			username = "Change!";
			localStorage.setItem("username", username);
		}

		return username;
	},

	setUsername: (username: string): void => {
		localStorage.setItem("username", username);
	}
};

