import type { Chessboard } from "cm-chessboard/src/Chessboard";

export enum MessageType {
	INIT = "INIT",
	START = "START",
	MOVE = "MOVE"
}

export type Message = Init | Start | Move;

type Init = {
	type: MessageType.INIT;
};

export type Start = {
	type: MessageType.START;
	color: string | null;
	gameId: string;
};

export type Castle = {
	rook: string;
	rookPosStart: string;
	rookPosEnd: string;
};

export type Move = {
	type: MessageType.MOVE;
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

export type Time = {
	white: number;
	black: number;
}

export type InitGame = {
	ws: WebSocket | null;
	board: Chessboard | null;
	gameId: string | null;
	color: string | null;
	isLoading: boolean;
};

export type GameState = {
	game: InitGame;
	lastMove: Move;
};