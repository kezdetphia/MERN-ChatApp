//dependencies
const express = require('express')
const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')
// const User = require('./models/User')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { registerUser, getUserProfile, loginUser } = require('./controllers/UserController')
const app = express()
const ws = require('ws')
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


//feedback of mongo connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log(error);
  });

//App listener
const server = app.listen(PORT, ()=>{
  try{
    console.log(`App is listening on ${PORT}`)
  }catch(error){
    console.log(error)
  }
})

//websocet server connection
const wss = new ws.WebSocketServer({server})
wss.on('connection', (connection)=>{
  console.log('Connected to websocket')
  connection.send('helloo')
})



