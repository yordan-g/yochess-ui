import { type Unsubscriber, writable, type Writable } from 'svelte/store';
import type { VisualMoveInput } from 'cm-chessboard/src/view/VisualMoveInput';
import { MARKER_TYPE, Markers } from 'cm-chessboard/src/extensions/markers/Markers.js';
import { BORDER_TYPE, Chessboard, FEN, INPUT_EVENT_TYPE } from 'cm-chessboard/src/Chessboard.js';

enum MessageType {
	INIT = 'INIT',
	START = 'START',
	MOVE = 'MOVE'
}

type Message = Init | Start | Move;

type Init = {
	type: MessageType.INIT;
};

type Start = {
	type: MessageType.START;
	color: string | null;
	gameId: string;
};

type Move = {
	type: MessageType.MOVE;
	piece: string;
	squareFrom: string;
	squareTo: string;
	gameId: string;
	valid: boolean;
	enPassantCapture: string | null;
};

type InitGame = {
	ws: WebSocket | null;
	board: Chessboard | null;
	gameId: string | null;
	color: string | null;
	position: string | null;
};

export type GameState = {
	lastMove: Move;
};

const initialState: GameState = {
	lastMove: {
		type: MessageType.MOVE,
		piece: '',
		squareFrom: '',
		squareTo: '',
		gameId: '',
		valid: true,
		enPassantCapture: null
	}
};

const gameNotStarted: InitGame = {
	ws: null,
	color: null,
	gameId: null,
	board: null,
	position: null
};

let initGame: InitGame = { ...gameNotStarted };
export const startedGameState: Writable<GameState> = writable(initialState);
export const isLoading: Writable<boolean> = writable(true);

export function initBoard(): Unsubscriber {
	initGame.board = new Chessboard(document.getElementById('containerId'), {
		position: FEN.start,
		assetsUrl: '../assets/',
		extensions: [{ class: Markers }],
		style: {
			cssClass: 'default',
			borderType: BORDER_TYPE.frame
		}
	});
	initGame.board.enableMoveInput(inputHandler);
	initGame.board.setOrientation(initGame.color!!);

	return startedGameState.subscribe(handleStateUpdate);
}

export async function handleStateUpdate(state: GameState): Promise<void> {
	switch (state.lastMove.valid) {
		case true: {
			console.log(`Moving ${state.lastMove.squareFrom} - ${state.lastMove.squareTo}`, state);
			await initGame.board?.movePiece(state.lastMove.squareFrom, state.lastMove.squareTo);
			if (state.lastMove.enPassantCapture) {
				await initGame.board?.setPiece(state.lastMove.enPassantCapture, null, true);
			}
			break;
		}
		default: {
			// console.log(`Moving ${state.lastMove.squareTo} - ${state.lastMove.squareFrom}`, state);
			// await initGame.board?.movePiece(state.lastMove.squareTo, state.lastMove.squareFrom);
			break;
		}
	}
}

function inputHandler(event: VisualMoveInput): boolean {
	initGame.board?.removeMarkers(MARKER_TYPE.frame);
	switch (event.type) {
		case INPUT_EVENT_TYPE.moveInputStarted:
			// console.log(`moveInputStarted`);
			return true;
		case INPUT_EVENT_TYPE.validateMoveInput:
			console.log(`validateMoveInput:`);
			console.log(event);
			console.log(event.chessboard.getPosition());

			sendMessage(initGame.ws, {
				type: MessageType.MOVE,
				piece: event.chessboard.getPiece(event.squareFrom),
				squareFrom: event.squareFrom,
				squareTo: event.squareTo,
				gameId: initGame.gameId ?? 'init',
				valid: true,
				enPassantCapture: null
			});
			return false;
		case INPUT_EVENT_TYPE.moveInputCanceled:
			console.log('moveInputCanceled');
			return true;
		case INPUT_EVENT_TYPE.moveInputFinished:
			return false;
		default: {
			return false;
		}
	}
}

export function closeWsConnection(): void {
	initGame.ws?.close();
	initGame = { ...gameNotStarted };
	startedGameState.set(initialState);
	isLoading.set(true);
}

export const sendMessage = (ws: WebSocket | null, lastMove: Move): void => {
	if (ws !== null) {
		ws.send(JSON.stringify(lastMove));
	}
};

export const connectToWs = (username: String): void => {
	initGame.ws = new WebSocket(`ws://localhost:8080/chess/${username}/${initGame.gameId}`);
	if (!initGame.ws) {
		throw new Error("Server didn't accept WebSocket");
	}

	initGame.ws.addEventListener('open', () => {
		console.log('Opened websocket');
	});

	initGame.ws.addEventListener('message', (rawMessage: MessageEvent<string>) => {
		const message: Message = JSON.parse(rawMessage.data);
		console.log('onMessage', message);

		switch (message.type) {
			case MessageType.INIT: {
				break;
			}
			case MessageType.START: {
				initGame.gameId = message.gameId;
				initGame.color = message.color;
				isLoading.set(false);
				break;
			}
			case MessageType.MOVE: {
				startedGameState.update((old: GameState) => ({
					lastMove: message
				}));
				break;
			}
			default:
				break;
		}
	});

	initGame.ws.addEventListener('close', (message) => {});

	initGame.ws.addEventListener('error', (message) => {
		console.log(message);
		console.log('Something went wrong with the WebSocket');
	});
};
