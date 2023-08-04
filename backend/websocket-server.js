const ws = require("ws");
const jwt = require("jsonwebtoken");
const { connection } = require("mongoose");
const { JWT_SECRET } = process.env;

const wssServer = (server) => {
  const wss = new ws.Server({ noServer: true });
  const clients = new Map();

  server.on("upgrade", (req, socket, head) => {
    // You can do additional checks here if needed, such as checking authentication or validating the connection.
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws, req) => {
    console.log("WebSocket connected");
    //extracting token string from header
    const cookies = req.headers.cookie;
    if (cookies) {
      const tokenCookieString = cookies
        .split(";")
        .find((str) => str.startsWith("token="));
      if (tokenCookieString) {
        const token = tokenCookieString.split("=")[1];
        if (token) {
          jwt.verify(token, JWT_SECRET, (err, userData) => {
            if (err) throw err;
            //destructure id and username from userData
            const { userId, username } = userData;
            //storing the desctucted infromation (userData.userId, userData.username) inside the connection object userId and username key
            //connection is inside 'wss'.client
            connection.userId = userId;
            connection.username = username;
            clients.set(ws, {userId, username})
          });
        }
      }
    }
    console.log([...clients.values()].map(c=>c.username))
 

    clients.set(ws, req); // Add the client to the clients map

    ws.on("message", (message) => {
      console.log("Received message", message);
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
      clients.delete(ws); // Remove the client from the clients map when the connection is closed
    });
  });
};

module.exports = wssServer;
