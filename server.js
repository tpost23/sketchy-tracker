const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let trackerState = { isOccupied: false, userName: null, time: null };

// Serve static files from the public directory
app.use(express.static('public'));

// WebSocket connection handler
wss.on('connection', (ws) => {
  // Send the current tracker state to the new client
  ws.send(JSON.stringify(trackerState));

  ws.on('message', (message) => {
    // Update the tracker state and broadcast it
    trackerState = JSON.parse(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(trackerState));
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
