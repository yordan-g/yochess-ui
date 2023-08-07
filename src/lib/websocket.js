const host = globalThis.location?.host.replace(/:\d+/, ':8080');
const protocol = globalThis.location?.protocol || 'http:';
const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';

export const createWebsocket = async (id) => {
    const wsURL = wsProtocol + '//' + host + '/chess/' + id;
    const ws = new WebSocket(wsURL);
    if (!ws) {
        throw new Error("Server didn't accept WebSocket");
    }
    return { id, ws };
};

export const init = async (id) => {
    if (!globalThis.window) {
        return;
    }

    return await createWebsocket(id);
};