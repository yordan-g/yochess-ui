import type { VisualMoveInput } from "cm-chessboard/src/view/VisualMoveInput";
import { MARKER_TYPE, Markers } from "cm-chessboard/src/extensions/markers/Markers";
import { PromotionDialog } from "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog";
import { BORDER_TYPE, Chessboard, FEN, INPUT_EVENT_TYPE } from "cm-chessboard/src/Chessboard";
import { type CommunicationError, type End, type GameState, type GameConfig, type Message, MessageType, type Move } from "$lib/types";
import { getContext } from "svelte";
import { PUBLIC_WS_BASE_URL } from "$env/static/public";
import { buildChangeNameMessage, START_TIME } from "$lib/utils.svelte";

const GAME_NOT_STARTED: GameConfig = {
	wsClient: null,
	color: null,
	gameId: null,
	board: null,
	isLoading: true,
	opponentUsername: null
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

export const GAME_STATE_KEY = "gameState";

export function initGameState(): GameState {
	let config = $state<GameConfig>({ ...GAME_NOT_STARTED });
	let lastMove = $state<Move>({ ...INIT_MOVE });
	let turn = $state<string>("w");
	let endState = $state<End>(buildInitialEndState());
	let communicationError = $state<CommunicationError>(buildInitialCommunicationError());

	function resetState() {
		config = { ...GAME_NOT_STARTED };
		lastMove = { ...INIT_MOVE };
		endState = buildInitialEndState();
		turn = "w";
		communicationError = buildInitialCommunicationError();
	}

	return {
		get config(): GameConfig {
			return config;
		},
		get lastMove(): Move {
			return lastMove;
		},
		set lastMove(value: Move) {
			lastMove = value;
		},
		resetState,
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
		},
		get communicationError(): CommunicationError {
			return communicationError;
		},
		set communicationError(value: CommunicationError) {
			communicationError = value;
		}
	};
}

export function getGameState(): GameState {
	return getContext<GameState>(GAME_STATE_KEY);
}

export function initBoard(config: GameConfig, lastMove: Move) {
	config.board = new Chessboard(document.getElementById("containerId"), {
		position: FEN.start,
		assetsUrl: "../assets/",
		extensions: [{ class: Markers }, { class: PromotionDialog }],
		style: {
			cssClass: "default",
			borderType: BORDER_TYPE.thin
		}
	});
	// console.log(`init board--- ${config.color}`);
	config.board.enableMoveInput(createMoveInputHandler(config, lastMove));
	config.board.setOrientation(config.color!!);
}

async function updateBoard(move: Move, board: Chessboard): Promise<void> {
	switch (move.valid) {
		case true: {
			// console.log(`Moving ${move.squareFrom} - ${move.squareTo}`, move);
			board.removeMarkers();
			await board.movePiece(move.squareFrom, move.squareTo);
			board.addMarker({ class: "last-move-marker", slice: "markerSquare" }, move.squareFrom);
			if (move.enPassantCapturePos) {
				await board.setPiece(move.enPassantCapturePos, null, true);
			}
			if (move.promotion) {
				await board.setPiece(move.squareTo, move.promotion, true);
			}
			if (move.castle) {
				await board.setPiece(move.castle.rookPosStart, null, true);
				await board.setPiece(move.castle.rookPosEnd, move.castle.rook, true);
			}
			break;
		}
		default: {
			break;
		}
	}
}

function createMoveInputHandler(config: GameConfig, lastMove: Move) {
	// the method signature below required by cm-chessboard.
	return function inputHandler(event: VisualMoveInput) {
		config.board?.removeMarkers(MARKER_TYPE.frame);
		switch (event.type) {
			case INPUT_EVENT_TYPE.moveInputStarted:
				return true;
			case INPUT_EVENT_TYPE.validateMoveInput:
				// console.log(`validateMoveInput:`);
				let moveRequest: Move = {
					kind: MessageType.MOVE,
					piece: event.chessboard.getPiece(event.squareFrom),
					squareFrom: event.squareFrom,
					squareTo: event.squareTo,
					gameId: config.gameId ?? "init",
					valid: false,
					enPassantCapturePos: null,
					promotion: null,
					castle: null,
					whiteCaptures: [],
					blackCaptures: [],
					timeLeft: lastMove.timeLeft,
					turn: lastMove.turn
				};

				if (isWhitePromotionMove(event)) {
					config.board?.showPromotionDialog(event.squareTo, "w", (result: any) => {
						// console.log("Promotion result", result);

						sendMessage(config.wsClient, { ...moveRequest, promotion: result.piece });
					});
					return false;
				}
				if (isBlackPromotionMove(event)) {
					config.board?.showPromotionDialog(event.squareTo, "b", (result: any) => {
						// console.log("Promotion result", result);

						sendMessage(config.wsClient, { ...moveRequest, promotion: result.piece });
					});
					return false;
				}

				sendMessage(config.wsClient, moveRequest);
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

export async function sendMessage(ws: WebSocket | null, message: Message) {
	// console.warn(`Sending message --- ${JSON.stringify(message)}`);

	if (ws !== null && ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify(message));
	}
}

export function connectToWebSocketServer(
	userId: String, gameState: GameState, username: string,
	rematchGameId: string | null,
	customGameId: string | null,
	isCreator: string | null
): void {
	let serverUrl;

	if (rematchGameId) {
		serverUrl = `${PUBLIC_WS_BASE_URL}/${userId}?rematchGameId=${encodeURIComponent(rematchGameId)}`;
	} else if (customGameId) {
		if (isCreator) {
			serverUrl = `${PUBLIC_WS_BASE_URL}/${userId}?customGameId=${encodeURIComponent(customGameId)}&isCreator=${isCreator}`;
		} else {
			serverUrl = `${PUBLIC_WS_BASE_URL}/${userId}?customGameId=${encodeURIComponent(customGameId)}`;
		}
	} else {
		serverUrl = `${PUBLIC_WS_BASE_URL}/${userId}`;
	}
	let wsClient = new WebSocket(serverUrl);

	if (!wsClient) {
		throw new Error("Server didn't accept WebSocket");
	}

	wsClient.addEventListener("open", (event: Event) => {
		console.log("Opened websocket");
	});

	wsClient.addEventListener("message", (event: MessageEvent) => {
		const message: Message = JSON.parse(event.data);
		// console.log("onMessage", message);

		switch (message.kind) {
			case MessageType.INIT: {
				gameState.config.gameId = message.gameId;
				if (message.type === "START") {
					/**
					 *  Resets the endState on the start of the new game
					 *  because end messages keep showing in the new game due to race condition between the websocket final End message of the last game
					 *  and the SvelteKit lifecycle functions that tries to reset the state.
					 **/
					gameState.endState = buildInitialEndState();

					gameState.config.isLoading = false;
					gameState.config.color = message.color;
					sendMessage(gameState.config.wsClient, buildChangeNameMessage(gameState.config.gameId, username));
				}
				break;
			}
			case MessageType.MOVE: {
				updateBoard(message, gameState.config.board!!);
				if (message.valid) {
					gameState.lastMove = message;
				}
				if (message.turn !== gameState.turn) {
					gameState.turn = message.turn;
				}
				break;
			}
			case MessageType.END: {
				gameState.endState = message;
				break;
			}
			case MessageType.CHANGE_NAME: {
				// the backend always sends the opposite player name change event!
				gameState.config.opponentUsername = message.name;
				break;
			}
			case MessageType.COMMUNICATION_ERROR: {
				gameState.communicationError = message;
				break;
			}
			default:
				break;
		}
	});

	wsClient.addEventListener("close", (event: CloseEvent) => {
	});

	wsClient.addEventListener("error", (event: Event) => {
		console.log(event);
		// console.log("Something went wrong with the WebSocket");
	});

	gameState.config.wsClient = wsClient;
}

function isWhitePromotionMove(event: VisualMoveInput): boolean {
	return event.squareFrom.charAt(1) === "7" &&
		event.squareTo.charAt(1) === "8" &&
		event.piece.charAt(1) === "p" &&
		event.piece.charAt(0) === "w";
}

function isBlackPromotionMove(event: VisualMoveInput): boolean {
	return event.squareFrom.charAt(1) === "2" &&
		event.squareTo.charAt(1) === "1" &&
		event.piece.charAt(1) === "p" &&
		event.piece.charAt(0) === "b";
}

export function buildInitialEndState(): End {
	return {
		kind: MessageType.END,
		gameId: "Initial End State",
		timeout: null,
		ended: false,
		leftGame: null,
		close: null,
		rematch: null,
		rematchSuccess: null,
		rematchGameId: null,
		gameOver: null
	};
}

function buildInitialCommunicationError(): CommunicationError {
	return {
		kind: MessageType.COMMUNICATION_ERROR,
		isPresent: false,
		userMessage: "Server Error"
	};
}
