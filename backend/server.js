//dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const wssServer = require("./websocket/ws-server");
require("./controllers/UserController");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  getMessages,
  logOutUser
} = require("./controllers/UserController");

const app = express();

const { PORT, MONGO_URI, CLIENT_URL } = process.env;
// const PORT = process.env.PORT;
// const MONGO_URI = process.env.MONGO_URI;
// const CLIENT_URL = process.env.CLIENT_URL;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: CLIENT_URL,
  })
);


//routes
app.get("/people", getAllUsers);

app.get("/messages/:userId", getMessages);

app.post("/register", registerUser);

app.post("/login", loginUser);

app.post("/logout", logOutUser);

app.get("/profile", getUserProfile);

//feedback of mongo connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

//App listener
const server = app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});

//websocket connection
wssServer(server);
