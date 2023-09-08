import { writable } from 'svelte/store';

type Game = {
	color: string;
	position: string;
};

type LastMove = {
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
	lastMove: LastMove;
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

export const sendMessage = (ws: WebSocket | null, lastMove: LastMove): void => {
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

	wsInit.addEventListener('message', (message) => {
		const parsed = JSON.parse(message.data);
		console.log('onMessage', parsed);
		console.log('open', parsed.color);

		if (parsed.color != undefined) {
			state.update((old: GameState) => ({
				...old,
				wsStage: 'OPEN',
				game: {
					...old.game,
					color: parsed.color
				}
			}));
		} else {
			state.update((old: GameState) => ({
				...old,
				wsStage: 'MESSAGING',
				lastMove: parsed
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

	// state.update((state) => {
	//     state.error = 'There was an error connecting websockets';
	//     return state;
	// });
	// return;
};

export default state;
