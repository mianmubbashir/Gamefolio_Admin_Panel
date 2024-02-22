const mongoose = require("mongoose");

const clipsSchema = new mongoose.Schema({
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
        enum: ["like"],
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

  date: {
    type: Date,
    default: Date.now,
  },
});

const Clips = mongoose.model("Clips", clipsSchema);

module.exports = Clips;
