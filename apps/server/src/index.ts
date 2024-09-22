import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ host: "0.0.0.0", port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data: any) {
        const message = JSON.parse(data);
        switch (message.type) {
            case 'sender':
                senderSocket = ws;
                console.log("Sender Set");
                break;

            case 'receiver':
                receiverSocket = ws;
                console.log("Receiver Set");
                break;

            case 'createOffer':
                if (ws !== senderSocket) return;
                receiverSocket?.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
                console.log("Sender Sent Create Offer");
                break;

            case 'createAnswer':
                if (ws !== receiverSocket) return;
                senderSocket?.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
                console.log("Sender Sent Create Answer");
                break;

            case 'iceCandidate':
                if (ws === senderSocket) {
                    receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
                    console.log("Receiver Sent Ice Candidate");
                } else if (ws === receiverSocket) {
                    senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
                    console.log("Sender Sent Ice Candidate");
                }
                break;

            case 'close':
                if (ws !== senderSocket) return;
                console.log("Close came from sender");
                receiverSocket?.send(JSON.stringify({ type: "close" }));
                break;

            default:
                console.log("Unknown message type:", message.type);
        }

    });
});

console.log("Server started at localhost: 8080");
