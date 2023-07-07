import {writable} from 'svelte/store';
import {init} from '$lib/websocket';

let ws;

const state = writable({
    id: '',
    game: {}
});

export const sendMessage = () => {
    ws.send(JSON.stringify({
                message: "Hello"
            }
        )
    );
}

export const connect = async (id) => {

    try {
        let resp = await init(id);

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
    });

    ws.addEventListener('message', (message) => {
        const parsed = JSON.parse(message.data);

        console.log('request received', message.data);
        console.log('request received', parsed);

        state.update((state) => {
            return {...state, game: parsed}
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
