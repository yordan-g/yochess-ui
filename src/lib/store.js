import {writable} from 'svelte/store';
import {init} from '$lib/websocket';

let ws;

const state = writable({
    id: "",
    wsStage: "OPEN",
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

export const sendMessage = (lastMove) => {
    // console.log(lastMove)
    ws.send(JSON.stringify(lastMove));
}

export const connect = async (id) => {
    try {
        let resp = await init(id);
        console.log("INIT WS")
        ws = resp.ws;
        state.update((state) => {
            const {id} = resp;
            return {...state, id};
        });
    } catch (e) {
        state.update((state) => {
            state.error = 'There was an error connecting websockets';
            return state;
        });
        return;
    }

    if (!ws) {
        state.update((state) => {
            state.error = 'There was an error connecting websockets';
            return state;
        });
        return;
    }

    ws.addEventListener('open', () => {
        console.log('Opened websocket');
        // console.log(message);
        // console.log(message.data);
        //
        // const init = JSON.parse(message.data);
        //
        // state.update((state) => {
        //     return {
        //         ...state,
        //         game: {
        //             ...state.game,
        //             color: init.color
        //         }
        //     };
        // });
    });

    ws.addEventListener('message', (message) => {
        console.log('request received', message);

        const parsed = JSON.parse(message.data);

        console.log('request received', message.data);
        // console.log('request received', parsed);

        state.update((state) => {
            return {...state, lastMove: parsed}
        });
    });

    ws.addEventListener('close', (_message) => {
        state.update((s) => {
            s.error = 'The websocket has closed';
            return s;
        });
    });

    ws.addEventListener('error', (_message) => {
        console.log(_message);
        console.log('Something went wrong with the WebSocket');
    });
};

export default state
