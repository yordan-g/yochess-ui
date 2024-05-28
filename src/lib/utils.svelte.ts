import { type Time, type End, MessageType, type ChangeName } from "$lib/types";

export const piecesMap = new Map([
	["bk", "&#9818;"], ["wk", "&#9812;"],
	["bq", "&#9819;"], ["wq", "&#9813;"],
	["br", "&#9820;"], ["wr", "&#9814;"],
	["bb", "&#9821;"], ["wb", "&#9815;"],
	["bn", "&#9822;"], ["wn", "&#9816;"],
	["bp", "&#9823;"], ["wp", "&#9817;"]
]);

export const order = ["p", "n", "b", "q", "k", "r"];
export const compareFn = (a: string, b: string) => order.indexOf(a[1]) - order.indexOf(b[1]);

export const START_TIME: Time = {
	white: 5,
	black: 5
};

export function initClockState() {
	let time = $state(500);
	let interval: NodeJS.Timeout;

	function start(timeLeft: number) {
		time = timeLeft;
		interval = setInterval(() => {
			if (time < 2) {
				// clearInterval(interval);
				time = 0;
			} else {
				time -= 1;
			}
		}, 1000);
	}

	function stop() {
		clearInterval(interval);
	}

	return {
		get time() {
			return time;
		},
		start,
		stop
	};
}

export function formatToClock(seconds: number) {
	if (seconds < 0) return "00:00";

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const paddedMinutes = minutes.toString().padStart(2, "0");
	const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

	return `${paddedMinutes}:${paddedSeconds}`;
}

export function gameResult(winner: string): string {
	switch (winner) {
		case "d":
			return "Draw!";
		case "w":
			return "White wins!";
		case "b":
			return "Black wins!";
		default:
			return "Bug";
	}
}

export function buildLeftGameMessage(gameId: string): End {
	return {
		kind: MessageType.END,
		gameId: gameId,
		timeout: null,
		ended: null,
		leftGame: true,
		close: null,
		rematch: null,
		rematchSuccess: null,
		rematchGameId: null,
		gameOver: null
	};
}

export function buildTimeoutMessage(gameId: string, winner: string): End {
	return {
		kind: MessageType.END,
		gameId: gameId,
		timeout: true,
		ended: true,
		leftGame: null,
		close: null,
		rematch: null,
		rematchSuccess: null,
		rematchGameId: null,
		gameOver: {
			winner: winner,
			result: "Timeout"
		}
	};
}

export function buildCloseEndMessage(gameId: string): End {
	return {
		kind: MessageType.END,
		gameId: gameId,
		timeout: null,
		ended: null,
		leftGame: null,
		close: true,
		rematch: null,
		rematchSuccess: null,
		rematchGameId: null,
		gameOver: null
	};
}

export function buildRematchMessage(gameId: string): End {
	return {
		kind: MessageType.END,
		gameId: gameId,
		timeout: null,
		ended: null,
		leftGame: null,
		close: null,
		rematch: true,
		rematchSuccess: null,
		rematchGameId: null,
		gameOver: null
	};
}

export function buildChangeNameMessage(gameId: string, username: string): ChangeName {
	return {
		kind: MessageType.CHANGE_NAME,
		gameId: gameId,
		name: username
	};
}

export function toNullableValue<T>(value: T | undefined): T | null {
	return value === undefined ? null : value;
}

export function stopEventPropagation(event: Event) {
	event.stopPropagation();
}
