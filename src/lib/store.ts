import { writable } from 'svelte/store';
import type { VisualMoveInput } from 'cm-chessboard/src/view/VisualMoveInput';
import { MARKER_TYPE, Markers } from 'cm-chessboard/src/extensions/markers/Markers.js';
import { BORDER_TYPE, Chessboard, FEN, INPUT_EVENT_TYPE } from 'cm-chessboard/src/Chessboard.js';

type Game = {
	color: string;
	position: string;
};

type Message = Init | Move;

type Init = {
	color: string;
};

type Move = {
	piece: string;
	squareFrom: string;
	squareTo: string;
	valid: boolean;
};

export type GameState = {
	id: string;
	wsStage: string;
	game: Game;
	lastMove: Move;
};

const initialState: GameState = {
	id: '',
	wsStage: '',
	game: {
		color: '',
		position: ''
	},
	lastMove: {
		piece: '',
		squareFrom: '',
		squareTo: '',
		valid: false
	}
};

export const state = writable(initialState);
let ws: WebSocket | null;
let board: Chessboard;

export function initBoard() {
	board = new Chessboard(document.getElementById('containerId'), {
		position: FEN.start,
		assetsUrl: '../assets/',
		extensions: [{ class: Markers }],
		style: {
			cssClass: 'default',
			borderType: BORDER_TYPE.frame
		}
	});
	board.enableMoveInput(inputHandler);
}

export async function handleStateUpdate(state: GameState) {
	if (state.wsStage == 'OPEN') {
		console.log('-- SET POSITION', state.game.color);
		await board.setOrientation(state.game.color);
		return;
	}

	switch (state.lastMove.valid) {
		case true: {
			console.log(`Moving ${state.lastMove.squareFrom} - ${state.lastMove.squareTo}`, state);
			await board.movePiece(state.lastMove.squareFrom, state.lastMove.squareTo);
			break;
		}
		default: {
			console.log(`Moving ${state.lastMove.squareTo} - ${state.lastMove.squareFrom}`, state);
			await board.movePiece(state.lastMove.squareTo, state.lastMove.squareFrom);
			break;
		}
	}
}

function inputHandler(event: VisualMoveInput): boolean {
	board.removeMarkers(MARKER_TYPE.frame);
	switch (event.type) {
		case INPUT_EVENT_TYPE.moveInputStarted:
			console.log(`moveInputStarted`);
			return true;
		case INPUT_EVENT_TYPE.validateMoveInput:
			console.log(`validateMoveInput:`);
			sendMessage(ws, {
				piece: event.chessboard.getPiece(event.squareFrom),
				squareFrom: event.squareFrom,
				squareTo: event.squareTo,
				valid: true
			});
			return true;
		case INPUT_EVENT_TYPE.moveInputCanceled:
			console.log('moveInputCanceled');
			return false;
		case INPUT_EVENT_TYPE.moveInputFinished:
			return true;
		default: {
			return false;
		}
	}
}

export function closeWsConnection(): void {
	ws?.close();
	state.set(initialState);
}

export const sendMessage = (ws: WebSocket | null, lastMove: Move): void => {
	if (ws !== null) {
		ws.send(JSON.stringify(lastMove));
	}
	// console.log(lastMove)
};

export const connectToWs = (id: String): void => {
	ws = new WebSocket('ws://localhost:8080/chess/' + id);
	if (!ws) {
		throw new Error("Server didn't accept WebSocket");
	}
	// console.log(wsInit);

	ws.addEventListener('open', () => {
		console.log('Opened websocket');
	});

	ws.addEventListener('message', (rawMessage: MessageEvent<string>) => {
		const message: Message = JSON.parse(rawMessage.data);
		console.log('onMessage', message);

		if ('color' in message) {
			state.update((old: GameState) => ({
				...old,
				wsStage: 'OPEN',
				game: {
					...old.game,
					color: message.color
				}
			}));
			return;
		}

		if ('piece' in message) {
			state.update((old: GameState) => ({
				...old,
				wsStage: 'MESSAGING',
				lastMove: message
			}));
		}
	});

	ws.addEventListener('close', (message) => {});

	ws.addEventListener('error', (message) => {
		console.log(message);
		console.log('Something went wrong with the WebSocket');
	});
};
