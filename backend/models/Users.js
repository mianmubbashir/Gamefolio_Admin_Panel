const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  username: {
    type: String,
  },

  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
  },

  profilePicture: {
    type: String,
  },

  dateOfBirth: {
    type: String,
  },

  bio: {
    type: String,
  },

  followers: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    },
  ],

  following: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    },
  ],

  block: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    },
  ],

  accountType: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },

  accountStatus: {
    type: String,
    enum: ["active", "deactive"],
    default: "active",
  },
  deactivatedAt: {
    type: Date,
    default: null,
  },

  signupMethod: {
    type: String,
    enum: ["email", "twitter", "google", "facebook"],
    default: "email",
  },

  preferences: [
    {
      type: String,
    },
  ],

  favoriteGames: [
    {
      type: String,
    },
  ],

  report: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      reportType: {
        type: String,
      },
      reportDescription: {
        type: String,
      },
    },
  ],

  coins: [
    {
      coinType: {
        type: String,
      },
      coinAmount: {
        type: Number,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  forgotOTP: {
    type: String,
  },
});

// hash user's password with salt before saving document to db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// extend matchPassword function unto userSchema
userSchema.methods.matchPassword = async function (enteredPassword) {
  let passcheck = await bcrypt.compare(enteredPassword, this.password);
  console.log("pass: ", passcheck, enteredPassword, this.password);
  return passcheck;
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
