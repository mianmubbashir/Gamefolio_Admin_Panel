const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
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

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
