// const ws = require("ws");
// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = process.env;

// const sendUpdatedOnlineUsers = () => {
//   const onlineUsers = [...clients.values()].map((c) => ({
//     userId: c.userId,
//     username: c.username,
//   }));

//   clients.forEach((value, client) => {
//     try {
//       client.send(
//         JSON.stringify({
//           online: onlineUsers,
//         })
//       );
//     } catch (error) {
//       console.error("Error sending data to client", error);
//     }
//   });
// };

// const swOnConnection = (ws, req) => {
//   console.log("WebSocket connected");
//   //extracting token string from header
//   const cookies = req.headers.cookie;
//   if (cookies) {
//     const tokenCookieString = cookies
//       .split(";")
//       .find((str) => str.startsWith("token="));
//     if (tokenCookieString) {
//       const token = tokenCookieString.split("=")[1];
//       if (token) {
//         jwt.verify(token, JWT_SECRET, (err, userData) => {
//           if (err) {
//             console.error("JWT verification error:", err.message);
//             ws.close(1000, "Invalid JWT token");
//             return;
//           }
//           //destructure id and username from userData
//           const { userId, username } = userData;
//           //storing the desctucted infromation (userData.userId, userData.username)
//           //setting the clients map the key is the ws-connection and the values are id and username
//           clients.set(ws, { userId, username });
//           console.log("clients been set", userId, username);
//         });
//         sendUpdatedOnlineUsers();
//       }
//     }
//   }
// };


// module.exports = {
//   swOnConnection,

// }