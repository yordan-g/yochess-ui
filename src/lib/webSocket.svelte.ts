import type { VisualMoveInput } from "cm-chessboard/src/view/VisualMoveInput";
import { MARKER_TYPE, Markers } from "cm-chessboard/src/extensions/markers/Markers";
import { PromotionDialog } from "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog";
import { BORDER_TYPE, Chessboard, FEN, INPUT_EVENT_TYPE } from "cm-chessboard/src/Chessboard";
import type { GameState, InitGame, Message, Move } from "$lib/types";
import { MessageType } from "$lib/types";
import { getContext } from "svelte";
import { PUBLIC_WS_BASE_URL } from "$env/static/public";

const GAME_NOT_STARTED: InitGame = {
	ws: null,
	color: null,
	gameId: null,
	board: null,
	isLoading: true
};

const INIT_MOVE: Move = {
	type: MessageType.MOVE,
	piece: "",
	squareFrom: "",
	squareTo: "",
	gameId: "",
	valid: false,
	enPassantCapturePos: null,
	promotion: null,
	castle: null,
	whiteCaptures: [],
	blackCaptures: []
};

const INITIAL_STATE: GameState = {
	game: { ...GAME_NOT_STARTED },
	lastMove: { ...INIT_MOVE }
};

export const GAME_STATE_KEY = "gameState";

export function initGameState() {
	const state = $state<GameState>(INITIAL_STATE);

	return {
		get state() {
			return state;
		}
	};
}

export function getGameState(): { readonly state: GameState } {
	return getContext(GAME_STATE_KEY);
}

export function initBoard(gameState: GameState) {
	gameState.game.board = new Chessboard(document.getElementById("containerId"), {
		position: FEN.start,
		assetsUrl: "../assets/",
		extensions: [{ class: Markers }, { class: PromotionDialog }],
		style: {
			cssClass: "default",
			borderType: BORDER_TYPE.thin
		}
	});
	gameState.game.board.enableMoveInput(createEventHandler(gameState));
	gameState.game.board.setOrientation(gameState.game.color!!);
}

async function updateBoard(move: Move, gameState: GameState): Promise<void> {
	switch (move.valid) {
		case true: {
			console.log(`Moving ${move.squareFrom} - ${move.squareTo}`, move);
			await gameState.game.board?.movePiece(move.squareFrom, move.squareTo);
			if (move.enPassantCapturePos) {
				await gameState.game.board?.setPiece(move.enPassantCapturePos, null, true);
			}
			if (move.promotion) {
				await gameState.game.board?.setPiece(move.squareTo, move.promotion, true);
			}
			if (move.castle) {
				await gameState.game.board?.setPiece(move.castle.rookPosStart, null, true);
				await gameState.game.board?.setPiece(
					move.castle.rookPosEnd,
					move.castle.rook,
					true
				);
			}
			break;
		}
		default: {
			break;
		}
	}
}

function createEventHandler(gameState: GameState) {
	// This is signature required by cm-chessboard.
	return function inputHandler(event: VisualMoveInput) {
		gameState.game.board?.removeMarkers(MARKER_TYPE.frame);
		switch (event.type) {
			case INPUT_EVENT_TYPE.moveInputStarted:
				// console.log(`moveInputStarted`);
				return true;
			case INPUT_EVENT_TYPE.validateMoveInput:
				console.log(`validateMoveInput:`);
				console.log(event);
				console.log(event.chessboard.getPosition());
				let moveRequest: Move = {
					type: MessageType.MOVE,
					piece: event.chessboard.getPiece(event.squareFrom),
					squareFrom: event.squareFrom,
					squareTo: event.squareTo,
					gameId: gameState.game.gameId ?? "init",
					valid: false,
					enPassantCapturePos: null,
					promotion: null,
					castle: null,
					whiteCaptures: [],
					blackCaptures: []
				};

				if (event.squareTo.charAt(1) === "8" && event.piece.charAt(1) === "p") {
					// @ts-ignore
					gameState.game.board?.showPromotionDialog(event.squareTo, "w", (result) => {
						console.log("Promotion result", result);

						sendMessage(gameState.game.ws, { ...moveRequest, promotion: result.piece });
					});
					return false;
				}
				if (event.squareTo.charAt(1) === "1" && event.piece.charAt(1) === "p") {
					// @ts-ignore
					gameState.game.board?.showPromotionDialog(event.squareTo, "b", (result) => {
						console.log("Promotion result", result);

						sendMessage(gameState.game.ws, { ...moveRequest, promotion: result.piece });
					});
					return false;
				}

				sendMessage(gameState.game.ws, moveRequest);
				return false;
			case INPUT_EVENT_TYPE.moveInputCanceled:
				console.log("moveInputCanceled");
				return true;
			case INPUT_EVENT_TYPE.moveInputFinished:
				return false;
			default: {
				return false;
			}
		}
	};
}

export async function closeWsConnection(gameState: GameState) {
	gameState.game.ws?.close();
	gameState.game = GAME_NOT_STARTED;
	gameState.lastMove = INIT_MOVE;
}

async function sendMessage(ws: WebSocket | null, moveRequest: Move) {
	if (ws !== null) {
		ws.send(JSON.stringify(moveRequest));
	}
}

export function connectToWs(username: String, gameState: GameState): void {
	gameState.game.ws = new WebSocket(
		`${PUBLIC_WS_BASE_URL}/${username}/${gameState.game.gameId}`
	);
	if (!gameState.game.ws) {
		throw new Error("Server didn't accept WebSocket");
	}

	gameState.game.ws.addEventListener("open", () => {
		console.log("Opened websocket");
	});

	gameState.game.ws.addEventListener("message", (rawMessage: MessageEvent<string>) => {
		const message: Message = JSON.parse(rawMessage.data);
		console.log("onMessage", message);

		switch (message.type) {
			case MessageType.INIT: {
				break;
			}
			case MessageType.START: {
				gameState.game.gameId = message.gameId;
				gameState.game.color = message.color;
				gameState.game.isLoading = false;
				break;
			}
			case MessageType.MOVE: {
				updateBoard(message, gameState);
				gameState.lastMove = message;
				break;
			}
			default:
				break;
		}
	});

	gameState.game.ws.addEventListener("close", (message) => {
	});

	gameState.game.ws.addEventListener("error", (message) => {
		console.log(message);
		console.log("Something went wrong with the WebSocket");
	});
}
