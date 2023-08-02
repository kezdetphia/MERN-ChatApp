//dependencies
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('./models/User')

const {PORT, MONGO_URI, JWT_SECRET}= process.env

const app = express()
app.use(express.json());



app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Create the user
    const createdUser = await User.create({ username, password });

    // Generate a JWT token
    jwt.sign({ userID: createdUser._id }, JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).status(201).json('JWT generated');
    });
  } catch (error) {
    // Handle any errors that occur during user creation
    console.error('Error creating user:', error);
    res.status(500).json('Error creating user');
  }
});















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





