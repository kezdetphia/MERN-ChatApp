const ws = require("ws");
const jwt = require("jsonwebtoken");
const fs = require('fs')
require("dotenv").config();

const {JWT_SECRET} = process.env
// const JWT_SECRET  = process.env.JWT_SECRET;


const Message = require("../models/Message");

//Define the WebSocket server function
const wssServer = (server) => {
  //Create a new WebSocket server instance using the provided HTTP server
  const wss = new ws.WebSocketServer({ server });

  //Evenet listener triggered when a new WS connection is established
  wss.on("connection", (connection, req) => {
    //Function to notify all clients avout online users
    const notifyAboutOnlinePeople =()=>{
      [...wss.clients].forEach((connection) => {
        //Send the list of online useres to all clients
        connection.send(
          JSON.stringify({
            online: [...wss.clients].map((c) => ({
              userId: c.userId,
              username: c.username,
            })),
          })
        );
      });
    }

    //Initialize conenction properties
    connection.isAlive = true;

    //Setup timer for checking connection health
    connection.timer = setInterval(()=>{
      connection.ping()
      connection.deathTimer = setTimeout(()=>{
        connection.isAlive = false;
        clearInterval(connection.timer)
        connection.terminate()
        notifyAboutOnlinePeople()
        console.log('dead')
      },1000)
    }, 5000)
    //Event listener for pong response from clients
    connection.on('pong', ()=>{
      clearTimeout(connection.deathTimer)
    })

    //Read username and id from cookie for this particular connection
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
    //Event listener to receive messages from clients
    connection.on("message", async (message) => {
      const messageData = await JSON.parse(message.toString());
      const { recipient, text } = messageData;
      //Handle file data if present
      
      //Check if recipient and message content are provided
      if (recipient && text ) {
        //Create a message document and store it in database
        const messageDoc = await Message.create({
          sender:connection.userId,
          recipient: recipient,
          text: text,
     
          });
        //Send the message to the specified recipients' clients
        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((c) =>
            c.send(JSON.stringify({
                text,
                sender: connection.userId,
                recipient: recipient,
                _id:messageDoc._id
              })
            )
          );
      }
    });

    //Notify every online user about the new connection
    notifyAboutOnlinePeople()

  });
};
//Export the WS server function
module.exports = wssServer;
