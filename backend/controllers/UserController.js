const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Message = require("../models/Message");

const { JWT_SECRET } = process.env;
const SALT = bcrypt.genSaltSync(8);

// Get user profile
const getUserProfile = async (req, res) => {
  const token = req.cookies?.token
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  }else {
    res.status(401).json('no token')
  }
};

const getUserDataFromRequest = async (req, res) => {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, userData) => {
        if (err) {
          reject(err); // Reject with the error
        } else {
          resolve(userData);
        }
      });
    } else {
      reject(new Error("No token")); // Reject with an error object
    }
  });
};

//Getting messages from database
// const getMessages = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const userData = await getUserDataFromRequest(req); // Await the Promise
//     const ourUserId = userData.userId;
//     const messages = await Message.find({
//       sender: { $in: [userId, ourUserId] },
//       recipient: { $in: [userId, ourUserId] }
//     }).sort({ createdAt: 1 });
//     res.json(messages);
//   } catch (err) {
//     console.error('Error fetching messages:', err);
//     res.status(500).json({ error: 'Error fetching messages' });
//   }
// };

const getMessages = async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req); // Await the Promise
  const ourUserId = userData.userId;
  if (userId && ourUserId) {
    const messages = await Message.find({
      sender: { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });

    res.json(messages);
  } else {
    // Handle the case where userId or ourUserId is undefined
    res.status(400).json({ error: "Invalid user IDs" });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
};

// Signup user
const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    //encrypt password use salt
    const hashPassword = bcrypt.hashSync(password, SALT);
    const createdUser = await User.create({ username, password: hashPassword });
    // Generate a JWT token
    const token = jwt.sign({ userID: createdUser._id, username }, JWT_SECRET);
    res
      .cookie("token", token, { sameSite: "none", secure: true })
      .status(201)
      .json({ message: "JWT Created", id: createdUser._id });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json("Error creating user");
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password, _id } = req.body;
    const foundUser = await User.findOne({ username });
    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
      const token = jwt.sign({ userId: foundUser._id, username }, JWT_SECRET);
      return res
        .cookie("token", token, { sameSite: "none", secure: true })
        .json({
          id: foundUser._id,
          username: foundUser.username,
          msg: "Logged in",
        });
    } else {
      // If the login fails, set the "Invalid credentials" response and send it immediately.
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.log("Error logging in:", err);
    // If an error occurs, set the "Error logging in" response and send it immediately.
    return res.status(500).json({ message: `Error logging in` });
  }
};

module.exports = {
  registerUser,
  getUserProfile,
  loginUser,
  getMessages,
  getAllUsers,
};
