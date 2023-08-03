// const mongoose = require('mongoose');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET } = process.env;

// Signup user
const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Create the user
    const createdUser = await User.create({ username, password });

    // Generate a JWT token
    jwt.sign({ userID: createdUser._id, username }, JWT_SECRET, (err, token) => {
      if (err) throw err;
      //saving the token in the client cookies
      res
        .cookie("token", token, { sameSite: "none", secure: true })
        .status(201)
        .json({
          message: "JWT generated",   
          _id: createdUser._id,
        });
    });
  } catch (error) {
    // Handle any errors that occur during user creation
    console.error("Error creating user:", error);
    res.status(500).json("Error creating user");
  }
};


//Get user profile
const getUserProfile = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, JWT_SECRET, (err, userData) => {
    if (err) throw err;
    res.json(userData);
  });
};


module.exports = {
  registerUser,
  getUserProfile,
};
