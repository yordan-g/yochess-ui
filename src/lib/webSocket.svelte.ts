import type { VisualMoveInput } from "cm-chessboard/src/view/VisualMoveInput";
import { MARKER_TYPE, Markers } from "cm-chessboard/src/extensions/markers/Markers";
import { PromotionDialog } from "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog";
import { BORDER_TYPE, Chessboard, FEN, INPUT_EVENT_TYPE } from "cm-chessboard/src/Chessboard";
import type { GameState, InitGame, Message, Move } from "$lib/types";
import { MessageType } from "$lib/types";
import { getContext } from "svelte";
import { PUBLIC_WS_BASE_URL } from "$env/static/public";
import { START_TIME } from "$lib/utils.svelte";

const GAME_NOT_STARTED: InitGame = {
	ws: null,
	color: null,
	gameId: null,
	board: null,
	isLoading: true
};

const INIT_MOVE: Move = {
	kind: MessageType.MOVE,
	piece: "",
	squareFrom: "",
	squareTo: "",
	gameId: "",
	valid: false,
	enPassantCapturePos: null,
	promotion: null,
	castle: null,
	whiteCaptures: [],
	blackCaptures: [],
	timeLeft: START_TIME,
	turn: "w"
};

const INITIAL_STATE: GameState = {
	game: { ...GAME_NOT_STARTED },
	lastMove: { ...INIT_MOVE }
};

export const GAME_STATE_KEY = "gameState";

export function initGameState() {
	const state = $state<GameState>(INITIAL_STATE);
	let turn = $state("w");
	let endState = $state({ end: false, winner: "d" });

	return {
		get state() {
			return state;
		},
		get turn() {
			return turn;
		},
		set turn(value: string) {
			turn = value;
		},
		get endState() {
			return endState;
		},
		set endState(value: any) {
			endState = value;
		}
	};
}

export function getGameState(): { endState: any, readonly state: GameState, turn: string } {
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
	// the method signature below required by cm-chessboard.
	return function inputHandler(event: VisualMoveInput) {
		gameState.game.board?.removeMarkers(MARKER_TYPE.frame);
		switch (event.type) {
			case INPUT_EVENT_TYPE.moveInputStarted:
				return true;
			case INPUT_EVENT_TYPE.validateMoveInput:
				console.log(`validateMoveInput:`);
				console.log(event);
				let moveRequest: Move = {
					kind: MessageType.MOVE,
					piece: event.chessboard.getPiece(event.squareFrom),
					squareFrom: event.squareFrom,
					squareTo: event.squareTo,
					gameId: gameState.game.gameId ?? "init",
					valid: false,
					enPassantCapturePos: null,
					promotion: null,
					castle: null,
					whiteCaptures: [],
					blackCaptures: [],
					timeLeft: gameState.lastMove.timeLeft,
					turn: gameState.lastMove.turn
				};

				if (
					event.squareFrom.charAt(1) === "7" &&
					event.squareTo.charAt(1) === "8" &&
					event.piece.charAt(1) === "p"
				) {
					gameState.game.board?.showPromotionDialog(event.squareTo, "w", (result: any) => {
						console.log("Promotion result", result);

						sendMessage(gameState.game.ws, { ...moveRequest, promotion: result.piece });
					});
					return false;
				}
				if (
					event.squareFrom.charAt(1) === "2" &&
					event.squareTo.charAt(1) === "1" &&
					event.piece.charAt(1) === "p"
				) {
					gameState.game.board?.showPromotionDialog(event.squareTo, "b", (result: any) => {
						console.log("Promotion result", result);

						sendMessage(gameState.game.ws, { ...moveRequest, promotion: result.piece });
					});
					return false;
				}

				sendMessage(gameState.game.ws, moveRequest);
				return false;
			case INPUT_EVENT_TYPE.moveInputCanceled:
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

export function connectToWs(username: String, game: any): void {
	game.state.game.ws = new WebSocket(
		`${PUBLIC_WS_BASE_URL}/${username}/${game.state.game.gameId}`
	);
	if (!game.state.game.ws) {
		throw new Error("Server didn't accept WebSocket");
	}

	game.state.game.ws.addEventListener("open", () => {
		console.log("Opened websocket");
	});

	game.state.game.ws.addEventListener("message", (rawMessage: MessageEvent<string>) => {
		const message: Message = JSON.parse(rawMessage.data);
		console.log("onMessage", message);

		switch (message.kind) {
			case MessageType.INIT: {
				if (message.type === "START") {
					game.state.game.gameId = message.gameId;
					game.state.game.color = message.color;
					game.state.game.isLoading = false;
				}
				break;
			}
			case MessageType.MOVE: {
				updateBoard(message, game.state);
				if (message.valid) {
					game.state.lastMove = message;
				}
				if (message.turn !== game.turn) {
					game.turn = message.turn;
				}
				break;
			}
			default:
				break;
		}
	});

	game.state.game.ws.addEventListener("close", (message: Message) => {
	});

	game.state.game.ws.addEventListener("error", (message: Message) => {
		console.log(message);
		console.log("Something went wrong with the WebSocket");
	});
}
