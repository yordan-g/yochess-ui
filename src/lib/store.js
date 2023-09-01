import {writable} from 'svelte/store';

const state = writable({
    ws: null,
    id: "",
    wsStage: "",
    game: {
        color: "",
        position: "",
    },
    lastMove: {
        piece: "",
        squareFrom: "",
        squareTo: "",
        valid: false
    }
});

export const reset = (ws) => {
    if (ws !== null) {
        ws.send(JSON.stringify({piece: "z"}));
    }
}

export const sendMessage = (ws, lastMove) => {
    if (ws !== null) {
        ws.send(JSON.stringify(lastMove));
    }
    // console.log(lastMove)
}

export const connect = (id) => {
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
            state.update((state) => {
                return {
                    ...state,
                    wsStage: "OPEN",
                    game: {
                        ...state.game,
                        color: parsed.color
                    }
                };
            });
        } else {
            state.update((state) => {
                return {
                    ...state, wsStage: "MESSAGING", lastMove: parsed
                }
            });
        }
    });

    wsInit.addEventListener('close', (_message) => {
    });

    wsInit.addEventListener('error', (_message) => {
        console.log(_message);
        console.log('Something went wrong with the WebSocket');
    });

    state.update((old) => {
        return {
            ...old, ws: wsInit
        };
    });

// state.update((state) => {
//     state.error = 'There was an error connecting websockets';
//     return state;
// });
// return;
}

export default state
