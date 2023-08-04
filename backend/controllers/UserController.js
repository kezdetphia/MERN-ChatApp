// const mongoose = require('mongoose');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const { JWT_SECRET } = process.env;
const SALT = bcrypt.genSaltSync(8);

//Get user profile
const getUserProfile = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, JWT_SECRET, (err, userData) => {
    if (err) throw err;
    res.json(userData);
  });
};

// Signup user
const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    //encrypt password use salt
    const hashPassword = bcrypt.hashSync(password, SALT);
    const createdUser = await User.create({ username, password: hashPassword });
    // Generate a JWT token
    const token = jwt.sign({userID: createdUser._id, username}, JWT_SECRET)
    res
      .cookie('token', token, {sameSite: 'none', secure: true})
      .status(201)
      .json({message: 'JWT Created', id: createdUser._id})

    // jwt.sign(
    //   { userID: createdUser._id, username },
    //   JWT_SECRET,
    //   (err, token) => {
    //     if (err) throw err;
    //     //saving the token in the client cookies
    //     res
    //     //samsite:none allows the cookie to be sent cross-site
    //     //secure true ensures that cookie will only be sent thru HTTP connections
    //       .cookie("token", token, { sameSite: "none", secure: true })
    //       .status(201)
    //       .json({
    //         message: "JWT generated",
    //         _id: createdUser._id,
    //       });
    //   }
    // );

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json("Error creating user");
  }
};


// const loginUser = async (req, res) => {
//   try{
//     const { username, password, _id } = req.body;
//     const foundUser = await User.findOne({ username });
//     if (foundUser) {
//       const passOk = bcrypt.compareSync(password, foundUser.password);
//       if (passOk) {
//         jwt.sign(
//           { userId: foundUser._id, username },
//           JWT_SECRET,
//           (err, token) => {
//             if (err) throw err;
//             res.cookie("token", token, { sameSite: "none", secure: true }).json({
//               id: foundUser._id,
//               username: foundUser.username
//             });
//           }
//         );
//       }
//     }
//   }catch (err){
//     console.log('Error logging in:', err)
//     res.status(500).json({mssg: 'Error logging In'})

//   }
// };

const loginUser = async (req, res) => {
  try {
    const { username, password, _id } = req.body;
    const foundUser = await User.findOne({ username });
    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
      const token = jwt.sign({ userId: foundUser._id, username }, JWT_SECRET);
      res.cookie("token", token, { sameSite: "none", secure: true }).json({
        id: foundUser._id,
        username: foundUser.username,
        msg: 'Logged in'
      });
    } else {
      //check why always only the first method gets called here
    }
    res.json({ message: "Invalid credentials" }).status(401)
  } catch (err) {
    console.log('Error logging in:', err);
    res.json({ message: `Error logging in` }).status(500)
  }
};


module.exports = {
  registerUser,
  getUserProfile,
  loginUser,
};
