const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// Create Schema. This is like MySQL where you declare the datatypes of the fields and if they are required
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// "user" is the name we give it now
// UserSchema is the value
// Similar to models in Controllers in Java
// This is the User model (see Profile.js for a better explanation of this line of code)
module.exports = User = mongoose.model("user", UserSchema);
