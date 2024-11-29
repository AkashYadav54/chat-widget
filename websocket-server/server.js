import { WebSocketServer } from "ws";

// Create a WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

// Sample SOPs and Alerts
const notificationData = {
  alerts: [
    {
      id: '1',
      message: 'New message from HR!',
      isRead: false,
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      message: 'Meeting scheduled for tomorrow.',
      isRead: true,
      timestamp: new Date().toISOString(),
    }
  ],
  sops: [
    {
      id: 'greeting',
      title: 'Welcome to the System',
      description: 'This is a greeting message for the user when they log in.',
      received: false,  // Initially not received
    },
    {
      id: 'procedure1',
      title: 'Password Reset',
      description: 'Steps for resetting your password securely.',
      received: false,  // Initially not received
    },
    {
      id: 'procedure2',
      title: 'Contact Support',
      description: 'Steps to reach out to support if you encounter any issues.',
      received: false,  // Initially not received
    }
  ]
};

// Start WebSocket connection and handle incoming messages
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Simulate sending data every 2 seconds (e.g., sending alerts and SOPs)
  const interval = setInterval(() => {
    try {
      // Simulate sending alerts and SOPs
      ws.send(
        JSON.stringify({
          sender: "Server",
          content: JSON.stringify(notificationData),  // Send the entire notification data
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, 2000);

  // Handle messages from the client
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    // Broadcast the received message to other connected clients
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

    // Simulate processing client message (e.g., marking SOP as received)
    // For example, if the message is "greeting", we can mark the greeting SOP as received
    if (message === 'greeting') {
      const greetingSop = notificationData.sops.find(sop => sop.id === 'greeting');
      if (greetingSop) {
        greetingSop.received = true;
      }
    }

    // Simulate sending back updated data after client interaction
    ws.send(
      JSON.stringify({
        sender: "Server",
        content: JSON.stringify(notificationData),  // Send updated SOP/alert data
        timestamp: new Date().toISOString(),
      })
    );
  });

  // Handle WebSocket closure
  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

// WebSocket server log
console.log("WebSocket server is running on ws://localhost:8080");

// Handle server shutdown on SIGINT (Ctrl + C)
process.on("SIGINT", () => {
  console.log("Shutting down WebSocket server...");
  wss.clients.forEach((client) => client.terminate());
  wss.close(() => console.log("Server closed."));
  process.exit(0);
});
