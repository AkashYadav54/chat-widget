// server.js
import { WebSocketServer } from 'ws';

// Create a WebSocket server that listens on port 8080
const wss = new WebSocketServer({ port: 8080 });

// Handle new client connections
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Handle incoming messages from clients
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        // Broadcast the message to all connected clients except the sender
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(`Someone said: ${message}`);
            }
        });
    });

    // Handle client disconnections
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Log the server URL to the console
console.log('WebSocket server is running on ws://localhost:8080');
