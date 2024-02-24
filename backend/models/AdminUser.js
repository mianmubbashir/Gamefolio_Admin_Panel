const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  name: {
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

  role: {
    type: String,
    enum: ["admin", "manager"],
    default: "manager",
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

  forgotOTP: {
    type: String,
  },
});

// hash AdminUser's password with salt before saving document to db
adminSchema.pre("save", async function (next) {
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

// extend matchPassword function unto adminSchema
adminSchema.methods.matchPassword = async function (enteredPassword) {
  let passcheck = await bcrypt.compare(enteredPassword, this.password);
  return passcheck;
};

const AdminUser = mongoose.model("AdminUser", adminSchema);

module.exports = AdminUser;
