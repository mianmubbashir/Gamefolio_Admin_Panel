const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },

  description: {
    type: String,
  },

  game: {
    type: String,
  },

  music: {
    type: String,
  },

  video: {
    type: String,
  },

  reactions: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      reactionType: {
        type: String,
        enum: ["like", "love"],
      },
    },
  ],

  comments: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      commentText: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  share: [
    {
      userID: {
        type: String,
      },
    },
  ],

  bookmarks: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
