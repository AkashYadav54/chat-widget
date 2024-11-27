import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  const interval = setInterval(() => {
    try {
      ws.send(
        JSON.stringify({
          sender: "Server",
          content: "Hello from server",
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, 200);

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    const broadcastMessage = JSON.stringify({
      sender: "Other Client",
      content: message,
      timestamp: new Date().toISOString(),
    });
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(broadcastMessage);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

console.log("WebSocket server is running on ws://localhost:8080");

process.on("SIGINT", () => {
  console.log("Shutting down WebSocket server...");
  wss.clients.forEach((client) => client.terminate());
  wss.close(() => console.log("Server closed."));
  process.exit(0);
});
