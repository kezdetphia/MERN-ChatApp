const mongoose = require("mongoose");
const { Schema } = mongoose;



const MessageSchema = new Schema({
  sender: {type: Schema.Types.ObjectId, ref: 'User'},
  recipient: {type: Schema.Types.ObjectId, ref: 'User'},
  text: String,

}, {timestamps: true})



module.exports = mongoose.model("Message", MessageSchema);