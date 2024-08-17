import type { Chessboard } from "cm-chessboard/src/Chessboard";

export enum MessageType {
	INIT = "INIT",
	MOVE = "MOVE",
	END = "END",
	DRAW = "DRAW",
	RESIGN = "RESIGN",
	CHANGE_NAME = "CHANGE_NAME",
	COMMUNICATION_ERROR = "COMMUNICATION_ERROR",
	CHAT_ENTRIES = "CHAT_ENTRIES",
}

export type Message = Init | Move | End | ChangeName | Draw | Resign | CommunicationError | ChatEntries;

export type CommunicationError = {
	kind: MessageType.COMMUNICATION_ERROR;
	isPresent: boolean;
	userMessage: string;
}

export type Init = {
	kind: MessageType.INIT;
	type: string;
	color: string | null;
	gameId: string;
};

export type End = {
	kind: MessageType.END;
	gameId: string;
	timeout: boolean | null;
	ended: boolean | null;
	leftGame: boolean | null;
	close: boolean | null;
	rematch: boolean | null;
	rematchSuccess: boolean | null;
	rematchGameId: string | null;
	gameOver: GameOver | null;
}

export type Move = {
	kind: MessageType.MOVE;
	piece: string;
	squareFrom: string;
	squareTo: string;
	gameId: string;
	valid: boolean;
	enPassantCapturePos: string | null;
	promotion: string | null;
	castle: Castle | null;
	whiteCaptures: string[];
	blackCaptures: string[];
	timeLeft: Time;
	turn: string;
};

export type ChangeName = {
	kind: MessageType.CHANGE_NAME;
	gameId: string;
	name: string;
}

export type Draw = {
	kind: MessageType.DRAW;
	gameId: string;
	offerDraw: boolean;
	denyDraw: boolean;
	drawLimitExceeded: boolean;
}

export type Resign = {
	kind: MessageType.RESIGN;
	gameId: string;
	requestedResignation: boolean;
	resignationConfirmed: boolean;
}

export type ChatEntry = {
	username: string;
	timestamp: string;
	text: string;
}

export type ChatEntries = {
	kind: MessageType.CHAT_ENTRIES;
	gameId: string;
	entries: ChatEntry[]
}

export type Time = {
	white: number;
	black: number;
}

export type Castle = {
	rook: string;
	rookPosStart: string;
	rookPosEnd: string;
};

export type GameState = {
	config: GameConfig;
	lastMove: Move;
	turn: string;
	endState: End;
	drawState: Draw;
	resignState: Resign;
	communicationError: CommunicationError;
	resetState: Function;
	chatState: ChatEntry[];
}

export type GameConfig = {
	wsClient: WebSocket | null;
	board: Chessboard | null;
	gameId: string | null;
	color: string | null;
	isLoading: boolean;
	username: string | null;
	usernameHistory: string[];
	opponentUsername: string | null;
};

export type GameOver = {
	winner: String | null;
	result: String | null;
};
