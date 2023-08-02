const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      // required: true,
      // unique: true,
    },
    username: {
      type: String,
      // unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  }, { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
