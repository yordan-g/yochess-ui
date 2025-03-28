import type { VisualMoveInput } from "cm-chessboard/src/view/VisualMoveInput";
import { MARKER_TYPE, Markers } from "cm-chessboard/src/extensions/markers/Markers";
import { PromotionDialog } from "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog";
import { BORDER_TYPE, Chessboard, FEN, INPUT_EVENT_TYPE } from "cm-chessboard/src/Chessboard";
import {
	type ChatEntry,
	type CommunicationError,
	type Draw,
	type End,
	type GameConfig,
	type GameState,
	type Message,
	MessageType,
	type Move,
	type Resign,
	type Time
} from "$lib/types";
import { getContext } from "svelte";
import { PUBLIC_ENABLE_ONE_PLAYER_MOVE_BOTH_PIECES, PUBLIC_WS_BASE_URL } from "$env/static/public";
import { buildChangeNameMessage } from "$lib/utils.svelte";
import { browser } from "$app/environment";

const LAST_MOVE_MARKER = { class: "last-move-marker", slice: "markerSquare" };

let NORMAL_MOVE_AUDIO: HTMLAudioElement | null = null;
let CASTLE_MOVE_AUDIO: HTMLAudioElement | null = null;
if (browser) {
	NORMAL_MOVE_AUDIO = new Audio("/sounds/piece-move.wav");
	NORMAL_MOVE_AUDIO.volume = 0.05;
	CASTLE_MOVE_AUDIO = new Audio("/sounds/castle-move.wav");
	CASTLE_MOVE_AUDIO.volume = 0.1;
}

const START_TIME: Time = {
	white: 420,
	black: 420
};

const GAME_NOT_STARTED: GameConfig = {
	wsClient: null,
	color: null,
	gameId: null,
	board: null,
	isLoading: true,
	username: null,
	usernameHistory: [],
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
	let drawState = $state<Draw>(buildInitialDrawState());
	let resignState = $state<Resign>(buildInitialResignState());
	let communicationError = $state<CommunicationError>(buildInitialCommunicationError());
	let chatState = $state<ChatEntry[]>([]);

	function resetState() {
		config = { ...GAME_NOT_STARTED };
		lastMove = { ...INIT_MOVE };
		endState = buildInitialEndState();
		drawState = buildInitialDrawState();
		resignState = buildInitialResignState();
		turn = "w";
		communicationError = buildInitialCommunicationError();
		chatState = [];
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
		get drawState() {
			return drawState;
		},
		set drawState(value: any) {
			drawState = value;
		},
		get resignState() {
			return resignState;
		},
		set resignState(value: any) {
			resignState = value;
		},
		get communicationError(): CommunicationError {
			return communicationError;
		},
		set communicationError(value: CommunicationError) {
			communicationError = value;
		},
		get chatState() {
			return chatState;
		},
		set chatState(value: ChatEntry[]) {
			chatState = value;
		},
	};
}

export function getGameState(): GameState {
	return getContext<GameState>(GAME_STATE_KEY);
}

export class PingPingInterval {
	interval = $state<NodeJS.Timeout | undefined>(undefined);

	start(wsClient: WebSocket) {
		this.interval = setInterval(
			() => {
				// console.warn("sending ping message ---");
				sendMessage(wsClient, { kind: MessageType.PING, text: "ping" });
			}, 29000
		);
	}

	clear() {
		// console.warn("clearing interval ---");
		clearInterval(this.interval);
	}
}

export function initBoard(gameConfig: GameConfig, lastMove: Move) {
	gameConfig.board = new Chessboard(document.getElementById("containerId"), {
		position: FEN.start,
		assetsUrl: "../assets/",
		extensions: [{ class: Markers }, { class: PromotionDialog }],
		style: {
			cssClass: "default",
			borderType: BORDER_TYPE.thin
		}
	});
	// console.log(`init board--- ${config.color}`);
	gameConfig.board.enableMoveInput(createMoveInputHandler(gameConfig, lastMove));
	gameConfig.board.setOrientation(gameConfig.color!!);
}

async function updateBoard(move: Move, board: Chessboard): Promise<void> {
	switch (move.valid) {
		case true: {
			// console.log(`Moving ${move.squareFrom} - ${move.squareTo}`, move);
			board.removeMarkers(LAST_MOVE_MARKER);
			await board.movePiece(move.squareFrom, move.squareTo);
			board.addMarker(LAST_MOVE_MARKER, move.squareFrom);
			if (move.enPassantCapturePos) {
				await board.setPiece(move.enPassantCapturePos, null, true);
			}
			if (move.promotion) {
				await board.setPiece(move.squareTo, move.promotion, true);
			}
			if (move.castle) {
				await board.setPiece(move.castle.rookPosStart, null, true);
				await board.setPiece(move.castle.rookPosEnd, move.castle.rook, true);
				CASTLE_MOVE_AUDIO?.play();
				break;
			}
			NORMAL_MOVE_AUDIO?.play();
		}
		default: {
			break;
		}
	}
}

function createMoveInputHandler(gameConfig: GameConfig, lastMove: Move) {
	// the method signature below required by cm-chessboard.
	return function inputHandler(event: VisualMoveInput) {
		gameConfig.board?.removeMarkers(MARKER_TYPE.frame);
		switch (event.type) {
			case INPUT_EVENT_TYPE.moveInputStarted:
				return true;
			case INPUT_EVENT_TYPE.validateMoveInput:
				// console.log(`validateMoveInput:`);
				if (
					PUBLIC_ENABLE_ONE_PLAYER_MOVE_BOTH_PIECES === "false" &&
					gameConfig.color != event.piece.charAt(0)
				) {
					return false;
				}
				let moveRequest: Move = {
					kind: MessageType.MOVE,
					piece: event.chessboard.getPiece(event.squareFrom),
					squareFrom: event.squareFrom,
					squareTo: event.squareTo,
					gameId: gameConfig.gameId ?? "init",
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
					gameConfig.board?.showPromotionDialog(event.squareTo, "w", (result: any) => {
						// console.log("Promotion result", result);

						sendMessage(gameConfig.wsClient, { ...moveRequest, promotion: result.piece });
					});
					return false;
				}
				if (isBlackPromotionMove(event)) {
					gameConfig.board?.showPromotionDialog(event.squareTo, "b", (result: any) => {
						// console.log("Promotion result", result);

						sendMessage(gameConfig.wsClient, { ...moveRequest, promotion: result.piece });
					});
					return false;
				}

				sendMessage(gameConfig.wsClient, moveRequest);
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
	isCreator: string | null,
	pingPongInterval: PingPingInterval
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

					pingPongInterval.start(gameState.config.wsClient!!)
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
				pingPongInterval.clear();
				gameState.endState = message;
				break;
			}
			case MessageType.DRAW: {
				gameState.drawState = message;
				break;
			}
			case MessageType.RESIGN: {
				gameState.resignState = message;
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
			case MessageType.CHAT_ENTRIES: {
				gameState.chatState = message.entries;
				break;
			}
			case MessageType.PONG: {}
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

export function buildInitialDrawState(): Draw {
	return {
		kind: MessageType.DRAW,
		gameId: "Initial Draw State",
		offerDraw: false,
		denyDraw: false,
		drawLimitExceeded: false
	};
}

export function buildInitialResignState(): Resign {
	return {
		kind: MessageType.RESIGN,
		gameId: "Initial Resign State",
		requestedResignation: false,
		resignationConfirmed: false
	};
}

function buildInitialCommunicationError(): CommunicationError {
	return {
		kind: MessageType.COMMUNICATION_ERROR,
		isPresent: false,
		userMessage: "Server Error"
	};
}
