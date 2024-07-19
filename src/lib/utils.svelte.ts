import { type End, MessageType, type ChangeName, type Draw, type Resign } from "$lib/types";
import { sendMessage } from "$lib/webSocket.svelte";

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

export function buildDrawMessage(gameId: string): Draw {
	return {
		kind: MessageType.DRAW,
		gameId: gameId,
		offerDraw: true,
		denyDraw: false,
		drawLimitExceeded: false
	};
}

export function buildDenyDrawMessage(gameId: string): Draw {
	return {
		kind: MessageType.DRAW,
		gameId: gameId,
		offerDraw: false,
		denyDraw: true,
		drawLimitExceeded: false
	};
}

export function buildResignationRequestMessage(gameId: string): Resign {
	return {
		kind: MessageType.RESIGN,
		gameId: gameId,
		requestedResignation: true,
		resignationConfirmed: false
	};
}

export function buildResignationConfirmedMessage(gameId: string): Resign {
	return {
		kind: MessageType.RESIGN,
		gameId: gameId,
		requestedResignation: false,
		resignationConfirmed: true
	};
}

export async function offerDraw(wsClient: WebSocket, gameId: string) {
	sendMessage(wsClient, buildDrawMessage(gameId));
}

export async function denyDraw(wsClient: WebSocket, gameId: string) {
	sendMessage(wsClient, buildDenyDrawMessage(gameId));
}

export async function resignRequest(wsClient: WebSocket, gameId: string) {
	sendMessage(wsClient, buildResignationRequestMessage(gameId));
}

export async function resignationConfirm(wsClient: WebSocket, gameId: string) {
	sendMessage(wsClient, buildResignationConfirmedMessage(gameId));
}

export function buildChangeNameMessage(gameId: string, username: string): ChangeName {
	return {
		kind: MessageType.CHANGE_NAME,
		gameId: gameId,
		name: username
	};
}

export function toNullableValue<T>(value: T | undefined): T | null {
	// console.log(`store from generic: ${value}`);
	return value === undefined ? null : value;
}

export function stopEventPropagation(event: Event) {
	event.stopPropagation();
}
