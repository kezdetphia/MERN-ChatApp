const ws = require("ws");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const Message = require("../models/Message");

const wssServer = (server) => {
  const wss = new ws.WebSocketServer({ server });

  //this event listener triggers when a new WS connection
  //is established between the client and server
  wss.on("connection", (connection, req) => {
    //read username and id from cookie for this
    //particular connection
    console.log("WebSocket connected");
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
            const { userId, username } = userData;
            connection.userId = userId;
            connection.username = username;
            console.log("Client connected:", userId, username);
          });
        }
      }
    }

    connection.on("message", async (message) => {
      const messageData = JSON.parse(message.toString());
      const { recipient, text } = messageData;
      if (recipient && text) {
        const messageDoc = await Message.create({
          sender:connection.userId,
          recipient: recipient,
          text: text
        });

        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((c) =>
            c.send(JSON.stringify({
                text,
                sender: connection.userId,
                recipient: recipient,
                id:messageDoc._id
              })
            )
          );
      }
    });

    //notify every online user about every online user
    [...wss.clients].forEach((connection) => {
      connection.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  });
};

module.exports = wssServer;
