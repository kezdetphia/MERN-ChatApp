//dependencies
const express = require('express')
const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')
// const User = require('./models/User')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { registerUser, getUserProfile, loginUser } = require('./controllers/UserController')
const app = express()
require('dotenv').config()
require('./controllers/UserController')

const {PORT, MONGO_URI, CLIENT_URL}= process.env

app.use(express.json());
app.use(cookieParser())

app.use(cors({
  credentials: true,
  origin: CLIENT_URL
}))


//routes
app.post('/register', registerUser );

app.post('/login', loginUser);

app.get('/profile', getUserProfile);














//feedback of connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    //App listener
    app.listen(PORT, () => {
      console.log(`Connected to db and listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });





