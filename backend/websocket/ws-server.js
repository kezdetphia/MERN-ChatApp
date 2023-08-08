const ws = require("ws");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const Message = require("../models/Message");

const wssServer = (server) => {
  const wss = new ws.Server({ noServer: true });
  const clients = new Map();

  //sends the all user details to all users that are online
  const sendUpdatedOnlineUsers = ()=>{
    //gets the userId and username from clients Map and assigns to onlineUsers variabe
    const onlineUsers = [...clients.values()].map((c)=>({
      userId: c.userId,
      username: c.username
    }))
    //iterates through clients Map, the key(client) is the websocket object
    //the value is userId and username
    clients.forEach((value,client)=>{
      try{
        client.send(JSON.stringify({
          online: onlineUsers
        }))
      }catch(error){
        console.error('Error sending data to client', error)
      }
    })
  }

  //this code sets up an event listener for the "upgrade" event on the HTTP server
  //When a client requests a websocket upgrade, the code uses the handleUpgrade method
  //of the WebSocket server to complete the upgrade process. After the upgrade is successful,
  //it emits a "connection" event on the WebSocket server, indicating that a new WebSocket
  //connection has been established.
  server.on("upgrade", (req, socket, head) => {
    //handleUpgrade -built in websocket func that upgrades the http connection to websocket connection
    //(ws) callback exexutes after the websocket upgrade is done
    wss.handleUpgrade(req, socket, head, (ws) => {
      //emit - notifies new conenction been establised
      //-ws represents the newly establised connection
      wss.emit("connection", ws, req);
    });
  });

  //this event listener triggers when a new WS connection
  //is established between the client and server
  wss.on("connection", (ws, req) => {
    console.log("WebSocket connected");
    //extracting token string from header
    //reading username and id from the cookie from the connection
    const cookies = req.headers.cookie;
    if (cookies) {
      const tokenCookieString = cookies
        .split(";")
        .find((str) => str.startsWith("token="));
      if (tokenCookieString) {
        const token = tokenCookieString.split("=")[1];
        if (token) {
          jwt.verify(token, JWT_SECRET, (err, userData) => {
            if (err) {
              console.error("JWT verification error:", err.message);
              ws.close(1000, "Invalid JWT token");
              return;
            }
            //destructure id and username from userData
            const { userId, username } = userData;
            //storing the desctucted infromation (userData.userId, userData.username)
            //setting the clients map the key is the ws-connection and the values are id and username
            clients.set(ws, { userId, username });
            console.log('clients been set', userId, username)
          });
          sendUpdatedOnlineUsers()
        }
      }
    }
    //clients- are key:value pairs, {websocket connections:HTTP requests}
    console.log([...clients.values()].map((c) => c.username));



    
   
    ws.on("message", async (message) => {
      const buffer = Buffer.from(message)
      const decodedString = buffer.toString('utf-8')
      try{
        const {recipient, text} = JSON.parse(decodedString)
        console.log('THIS IS TEXT', text)
        if (recipient && text){
          
          //if recipient and text are present
          //save the data in mongoDB
          const messageDocument = await Message.create({
            //ws. userId is whoever is logged in from a device
            sender: ws.userId,
            recipient: recipient,
            text: text
          });

          //Loop thru clients and findsh the client with the
          //recipients userId. Then loop through the found id's
          //(there might be more of the same id from different devices)
          //and the send the json with the data
          [...clients]
            .filter(c=> c.userId===recipient)
            .forEach(c=> c.send(JSON.stringify({
              text: text,
              sender: ws.userId,
              id: messageDocument._id
            }
          )))
        }
      }catch(error){
        console.error('Error parsing JSON', error)

      }
    })


    ws.on("close", () => {
      console.log("WebSocket connection closed");
      clients.delete(ws); // Remove the client from the clients map when the connection is closed
    });
  });
};

module.exports = wssServer;
