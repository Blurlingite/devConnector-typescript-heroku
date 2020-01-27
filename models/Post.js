const mongoose = require("mongoose");
// See section 5 video 24 for explanations
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },

  // name and avatar are here so we don't need the user object to display the user's posts if the user deletes their account
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    // include an array of user objects (by their ObjectId) so 1 user can't like a post multiple times
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        // comments have text in them
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
