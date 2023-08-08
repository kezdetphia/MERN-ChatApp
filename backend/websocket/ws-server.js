const ws = require("ws");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const wssServer = (server) => {
  const wss = new ws.Server({ noServer: true });
  const clients = new Map();

  //sends the all user details to all users that are online
  const sendUpdatedOnlineUsers = ()=>{
    const onlineUsers = [...clients.values()].map((c)=>({
      userId: c.userId,
      username: c.username
    }))

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



    
   
    ws.on("message", (message) => {
      const messageData = JSON.parse(message.toString())
      const {recipient, text} = messageData
      console.log('THIS IS TEXT', text)

      try{
        if (recipient && text){
          [...clients]
            .filter(c=> c.userId===recipient)
            .forEach(c=> c.send(JSON.stringify({text, sender: ws.userId})))
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
