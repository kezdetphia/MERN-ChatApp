const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { JWT_SECRET } = process.env;

// Signup user
const registerUser = async (req, res) => {
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
};

module.exports = {
  registerUser,
};
