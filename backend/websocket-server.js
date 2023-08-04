const ws = require("ws");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const wssServer = (server) => {
  const wss = new ws.Server({ noServer: true });
  const clients = new Map();

  //this code sets up an event listener for the "upgrade" event on the HTTP server
  //When a client requests a websocket upgrade, the code uses the handleUpgrade method
  //of the WebSocket server to complete the upgrade process. After the upgrade is successful, 
  //it emits a "connection" event on the WebSocket server, indicating that a new WebSocket 
  //connection has been established.
  server.on("upgrade", (req, socket, head) => {
    //handleUpgrade -built in ws func that upgrades the http connection to websocket connection
    //(ws) callback exexutes after the websocket upgrade is done
    wss.handleUpgrade(req, socket, head, (ws) => {
      //emit - notifies new conenction been establised
      //-ws represents the newly establised connection
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
