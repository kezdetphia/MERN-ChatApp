const ws = require("ws");

const wssServer = (server) => {
  const wss = new ws.Server({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket connected");

    ws.on("message", (message) => {
      console.log("Received message", message);
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });
};

module.exports = wssServer;
