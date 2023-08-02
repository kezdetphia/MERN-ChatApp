//dependencies
const express = require('express')
const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')
const User = require('./models/User')
const cors = require('cors')
const { registerUser } = require('./controllers/registerUser')
const app = express()
require('dotenv').config()
require('./controllers/registerUser')

const {PORT, MONGO_URI, JWT_SECRET, CLIENT_URL}= process.env

app.use(express.json());

app.use(cors({
  credentials: true,
  origin: CLIENT_URL
}))


//routes
app.post('/register', registerUser );















//feedback of connection
mongoose.connect(MONGO_URI)
  .then(() => {
    //App listener
    app.listen(PORT, () => {
      console.log(`Connected to db and listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });





