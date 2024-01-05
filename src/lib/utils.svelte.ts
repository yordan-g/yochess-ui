import type { Time } from "$lib/types";

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

export function clockState() {
	let time = $state(5);
	let interval;

	function start(timeLeft: number) {
		// clearInterval(interval);
		time = timeLeft;
		interval = setInterval(() => {
			if (time < 2) {
				clearInterval(interval);
			}
			time -= 1;
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
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const paddedMinutes = minutes.toString().padStart(2, "0");
	const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

	return `${paddedMinutes}:${paddedSeconds}`;
}

export function gameResult(winner: string): string {
	switch (winner) {
		case "d": return "Draw!"
		case "w": return "White wins!"
		case "b": return "Black wins!"
		default: return "Draw!"
	}
}