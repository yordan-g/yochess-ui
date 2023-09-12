import { writable } from 'svelte/store';

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
	ws: WebSocket | null;
	id: string;
	wsStage: string;
	game: Game;
	lastMove: Move;
};

const initialState: GameState = {
	ws: null,
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

const state = writable(initialState);

export const reset = (ws: WebSocket | null): void => {
	if (ws !== null) {
		ws.send(JSON.stringify({ piece: 'z' }));
	}
};

export const sendMessage = (ws: WebSocket | null, lastMove: Move): void => {
	if (ws !== null) {
		ws.send(JSON.stringify(lastMove));
	}
	// console.log(lastMove)
};

export const connect = (id: String): void => {
	const wsInit = new WebSocket('ws://localhost:8080/chess/' + id);
	if (!wsInit) {
		throw new Error("Server didn't accept WebSocket");
	}
	console.log(wsInit);

	wsInit.addEventListener('open', () => {
		console.log('Opened websocket');
	});

	wsInit.addEventListener('message', (rawMessage: MessageEvent<string>) => {
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

	wsInit.addEventListener('close', (_message) => {});

	wsInit.addEventListener('error', (_message) => {
		console.log(_message);
		console.log('Something went wrong with the WebSocket');
	});

	state.update((old: GameState) => ({
		...old,
		ws: wsInit
	}));
};

export default state;
