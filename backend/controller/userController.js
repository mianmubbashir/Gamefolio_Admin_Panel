const asyncHandler = require("express-async-handler");
const User = require("../models/Users.js");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken.js");
const generateOTP = require("../utils/generateOtp.js");
const { sendEmail, sendForgotOtpEmail } = require("../utils/sendEmail.js");

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  // check if email exists in db
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(404).json({ message: "User already exist" });
    // throw new Error("User already exists");
  }

  // create new user document in db
  const user = await User.create({
    name,
    username,
    email,
    password,
    signupMethod: "email",
  });

  if (user) {
    sendEmail(user);
    res.status(201).json({
      _id: user._id,
      AccountStatus: user.accountStatus,
      role: user.Role,
      name: user.name,
      username: user.username,
      email: user.email,
      signupMethod: user.signupMethod,
      message: "Successfully Sign Up",
    });
  } else {
    return res.status(400).json({
      message: "Invalid user data",
    });
    // throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if user email exists in db
  const user = await User.findOne({ email });

  // return user obj if their password matches
  if (user && (await user.matchPassword(password))) {
    // if (user.AccountStatus === "pending") {
    //   res.status(402).send("Please verify your email first");
    //   throw new Error("Please verify your email first");
    // }
    // Check if the user account is deactivated
    if (user.accountStatus === "deactive") {
      // If the account is deactivated, update the status to "active"
      user.accountStatus = "active";
      user.deactivatedAt = null;
      await user.save();
    }

    // verified token returns user id
    const decoded = jwt.verify(generateToken(user._id), process.env.JWT_SECRET);
    console.log("decode: ", decoded);
    console.log({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      // password: user.password,
      token: generateToken(user._id),
    });

    return res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      preferences: user.preferences,
      favoriteGames: user.favoriteGames,
      bio: user.bio,
      dateOfBirth: user.dateOfBirth,
      accountType: user.accountType,
      signupMethod: user.signupMethod,
      token: generateToken(user._id),
      message: "Successfully Sign in",
    });
  } else {
    return res.status(400).json({
      message: "Sorry! We were unable to log you in, please try again later",
    });
    // throw new Error("Login failed. Email or password is incorrect.");
  }
});

const sendEmailOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  console.log("EMAIL : ", email);

  // check if user email exists in db
  const user = await User.findOne({ Email: email });
  console.log("user: ", user);

  // return user obj if their password matches
  if (user) {
    let otp = generateOTP();
    let mysendEmail = await sendEmail(email, otp);
    console.log("yess: ", mysendEmail);
    if (mysendEmail) {
      res.json(otp);
    } else {
      res.json({ message: "error" });
    }
  } else {
    return res.status(401).send("User already exist  ");
  }
});

const verifyEmailOTP = asyncHandler(async (req, res) => {
  const { email, inputOtp, otpCode } = req.body;

  console.log("EMAIL : ", email);

  const verifyOtp = async (otp, inputOtp) => {
    if (otp === inputOtp) {
      user.AccountStatus = "verified";
      await user.save();
      return "correct";
    } else {
      return "wrong";
    }
  };

  // check if user email exists in db
  const user = await User.findOne({ Email: email });

  // return user obj if their password matches
  if (user) {
    // let otp = generateOTP();
    let myOtpVerification = await verifyOtp(otpCode, inputOtp);
    console.log("yess: ", myOtpVerification);
    if (myOtpVerification === "correct") {
      return res.json("verified");
    } else {
      res.status(401).json({ error: "Wrong OTP" });
      throw new Error("Wrong OTP");
    }
  } else {
    return res.status(401).send("Something went wrong");
  }
});

// Forgot password controllers
const sendForgotPasswordOTP = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received request for forget password with email:", email);

    // Check if user with the provided email exists in the database
    const user = await User.findOne({ email: email });

    // Check if user exists and has signupMethod as 'email'
    if (user && user.signupMethod === "email") {
      const otp = generateOTP(6);
      const emailSent = await sendForgotOtpEmail(email, otp);
      user.forgotOTP = otp;
      await user.save();

      if (emailSent) {
        return res.json({ message: "OTP sent successfully" });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to send OTP. Please try again later." });
      }
    } else {
      return res.status(404).json({
        message: "Invalid email ",
      });
    }
  } catch (error) {
    console.error("Error :", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

const verifyForgetPasswordOTP = asyncHandler(async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log(
      "Received request to verify OTP for forget password with email:",
      email,
      otp
    );

    // Check if user with the provided email exists in the database
    const user = await User.findOne({ email: email });

    // Check if user exists and has signupMethod as 'email'
    if (user && user.signupMethod === "email") {
      // Check if the provided OTP matches the stored OTP
      if (otp === user.forgotOTP) {
        // If OTP is valid, you can implement the logic for resetting the password here
        // For example, redirect the user to a password reset page
        res.json({
          message:
            "OTP verified successfully. You can now reset your password.",
        });
      } else {
        res
          .status(404)
          .json({ message: "Invalid OTP. Please check and try again." });
      }
    } else {
      res.status(404).json({
        message:
          "Invalid email or signup method. Make sure you signed up with an email.",
      });
    }
  } catch (error) {
    console.error("Error in verifyForgetPasswordOtp:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    console.log(
      "Received request to change password with email and OTP:",
      email,
      otp
    );

    // Check if user with the provided email exists in the database
    const user = await User.findOne({ email: email });

    // Check if user exists and has signupMethod as 'email'
    if (user && user.signupMethod === "email") {
      // Check if the provided OTP matches the stored OTP
      if (otp === user.forgotOTP) {
        // Verify that the new password matches the confirmed password
        if (password === confirmPassword) {
          // Update the password and set forgotOTP to null
          user.password = password;
          user.forgotOTP = null;

          // Save the updated user
          await user.save();

          res.json({ message: "Password changed successfully." });
        } else {
          res
            .status(400)
            .json({ message: "Password and confirm password do not match." });
        }
      } else {
        res
          .status(401)
          .json({ message: "Invalid OTP. Please check and try again." });
      }
    } else {
      res.status(404).json({
        message:
          "Invalid email or signup method. Make sure you signed up with an email.",
      });
    }
  } catch (error) {
    console.error("Error in changePassword:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

const updateLoginUser = asyncHandler(async (req, res) => {
  console.log("req.decodeduid::<<>> ", req.decodeduid);

  const user = await User.findById(req.decodeduid);

  // return user obj if their password matches
  if (user) {
    console.log({
      _id: user._id,
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.email,
      role: user.Role,
      phoneNumber: user.PhoneNumber,
    });
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePicture: user.profilePicture,
      dateOfBirth: user.dateOfBirth,
      accountType: user.accountType,
      signupMethod: user.signupMethod,
      follower: user.followers,
      following: user.following,
      block: user.block,
      report: user.report,
      userToken: req.token,
    });
  } else {
    return res.status(401).send("Something went wrong ");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  // req.user was set in authMiddleware.js
  console.log("req.body.userToken: ", req.body.userToken);
  const decoded = jwt.verify(req.body.userToken, process.env.JWT_SECRET);

  console.log("decoded: ", decoded);

  const user = await User.findById(decoded.id)
    .populate({
      path: "followers.userID",
      select: "name username profilePicture", // Specify the fields you want to retrieve
    })
    .populate({
      path: "following.userID",
      select: "name username profilePicture", // Specify the fields you want to retrieve
    })
    .populate({
      path: "block.userID",
      select: "name username profilePicture", // Specify the fields you want to retrieve
    });
  console.log("user: ", user);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePicture: user.profilePicture,
      dateOfBirth: user.dateOfBirth,
      accountType: user.accountType,
      signupMethod: user.signupMethod,
      follower: user.followers,
      following: user.following,
      block: user.block,
      report: user.report,
      coins: user.coins,
    });
  } else {
    return res.status(404).json({
      message: "Could not find user",
    });
  }
});

const getProfileInfo = asyncHandler(async (req, res) => {
  const { username } = req.body;
  console.log("username: ", username);

  const user = await User.findOne({ username })
    .populate({
      path: "followers.userID",
      select: "name username profilePicture", // Specify the fields you want to retrieve
    })
    .populate({
      path: "following.userID",
      select: "name username profilePicture", // Specify the fields you want to retrieve
    })
    .populate({
      path: "block.userID",
      select: "name username profilePicture", // Specify the fields you want to retrieve
    });
  console.log("user: profileInfo ", user);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePicture: user.profilePicture,
      dateOfBirth: user.dateOfBirth,
      accountType: user.accountType,
      signupMethod: user.signupMethod,
      follower: user.followers,
      following: user.following,
      block: user.block,
      report: user.report,
    });
  } else {
    return res.status(404).json({
      message: "Could not find user",
    });
  }
});

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res
      .status(201)
      .json({ data: users, message: "Successfully Retrieve Users" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not retrieve users.",
      message: "Could not retrieve users.",
    });
  }
};

const updatePassword = asyncHandler(async (req, res) => {
  const { userID, password, newPassword } = req.body; // Assuming password and newPassword are sent in the request body
  try {
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the entered old password matches the user's current password
    const isMatch = await user.matchPassword(password);

    console.log("isMatch: ", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid old password",
        error: "Invalid old password",
      });
    }

    // If the old password matches, update the password with the new one
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating password" });
  }
});

const addPreferences = asyncHandler(async (req, res) => {
  const { userID, preference } = req.body;

  console.log("req.body: ", req.body);

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.preferences = preference;
    await user.save();

    res.status(200).json({ message: "Preferences updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const addFavoriteGames = asyncHandler(async (req, res) => {
  const { userID, favoriteGame } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favoriteGames = favoriteGame;
    await user.save();

    res.status(200).json({ message: "Favorite games updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const report = asyncHandler(async (req, res) => {
  const { userID, report, description } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.report.push({
      userID,
      reportType: report,
      reportDescription: description,
    });
    await user.save();

    res.status(200).json({ message: "Report updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Controller to update user profile
const updateProfile = async (req, res) => {
  const {
    userID,
    name,
    username,
    profilePicture,
    dateOfBirth,
    bio,
    accountType,
  } = req.body;

  try {
    // Find the user by ID
    console.log("updateProfile: ", req.body);
    let user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user object with new profile information
    user.name = name || user.name;
    user.username = username || user.username;
    user.profilePicture = profilePicture || user.profilePicture;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.bio = bio || user.bio;
    user.accountType = accountType || user.accountType;

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log("error: ", error.message);
    res
      .status(500)
      .json({ message: "Could not update profile", error: error.message });
  }
};

// Followers
const addFollowers = asyncHandler(async (req, res) => {
  const { userId, followerID } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the follower is already in the followers list
    const isFollower = user.followers.find(
      (follower) => follower.userID.toString() === followerID
    );

    if (isFollower) {
      return res.status(400).json({ message: "Already a follower" });
    }

    // Add the follower to the user's followers list
    user.followers.push({ userID: followerID });
    await user.save();

    const fUser = await User.findById(followerID);
    // Add the following to the user's following list
    fUser.following.push({ userID: userId });
    await fUser.save();

    // Use populate to retrieve additional information about the follower
    const followedUser = await User.find()
      .sort({ date: -1 })
      .populate("followers.userID");

    console.log("Updated user:", followedUser);

    const followingUser = await User.find()
      .sort({ date: -1 })
      .populate("following.userID");

    console.log("followingUser:", followingUser);

    return res.status(201).json({
      message: "Follower added successfully",
      isFollowing: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

const removeFollower = asyncHandler(async (req, res) => {
  const { userId, followerID } = req.body;
  console.log("req.body##: ", req.body);
  try {
    // Find the user who is being followed
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", error: "User not found" });
    }

    // Check if the follower is in the followers list
    const followerIndex = user.followers.findIndex(
      (follower) => follower.userID.toString() === followerID
    );

    if (followerIndex === -1) {
      return res
        .status(400)
        .json({ message: "Follower not found", error: "Follower not found" });
    }

    // Remove the follower from the user's followers list
    user.followers.splice(followerIndex, 1);
    await user.save();

    // Find the follower user to remove the following entry
    const followerUser = await User.findById(followerID);
    const followingIndex = followerUser.following.findIndex(
      (following) => following.userID.toString() === userId
    );

    if (followingIndex !== -1) {
      followerUser.following.splice(followerIndex, 1);
      await followerUser.save();
    }

    // Use populate to retrieve additional information about the updated user
    const updatedUser = await User.findById(userId)
      .populate("followers.userID")
      .populate("following.userID");

    return res.status(200).json({
      message: "Follower removed successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: "Server Error" });
  }
});

// Remove Following

const removeFollowing = asyncHandler(async (req, res) => {
  const { userId, followingID } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is following
    const followingIndex = user.following.findIndex(
      (following) => following.userID.toString() === followingID
    );

    if (followingIndex === -1) {
      return res.status(400).json({ message: "Not following user" });
    }

    // Remove the following user from the user's following list
    user.following.splice(followingIndex, 1);
    await user.save();

    // Find the following user to remove the follower entry
    const followingUser = await User.findById(followingID);
    const followerIndex = followingUser.followers.findIndex(
      (follower) => follower.userID.toString() === userId
    );

    if (followerIndex !== -1) {
      followingUser.followers.splice(followerIndex, 1);
      await followingUser.save();
    }

    // Use populate to retrieve additional information about the updated user
    const updatedUser = await User.findById(userId)
      .populate("followers.userID")
      .populate("following.userID");

    return res.status(200).json({
      message: "Following removed successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// Block a user
const blockUser = asyncHandler(async (req, res) => {
  const { userId, blockedUserId } = req.body;
  console.log("req.body____: ", req.body);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already blocked
    const isBlocked = user.block.find(
      (blockedUser) => blockedUser.userID.toString() === blockedUserId
    );

    if (isBlocked) {
      return res.status(400).json({ message: "User is already blocked" });
    }

    // Block the user
    user.block.push({ userID: blockedUserId });
    await user.save();

    // Populate data for the blocked user
    const blockedUser = await User.find()
      .sort({ date: -1 })
      .populate("block.userID");

    console.log("blockedUser:", blockedUser);

    return res.status(201).json({
      message: "User blocked successfully",
      blockedUser: blockedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

// Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
  const { userId, unblockedUserId } = req.body;
  console.log("req.body____: ", req.body);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is blocked
    const blockedUserIndex = user.block.findIndex(
      (blockedUser) => blockedUser.userID.toString() === unblockedUserId
    );

    if (blockedUserIndex === -1) {
      return res.status(400).json({ message: "User is not blocked" });
    }

    // Remove the block entry for the unblocked user
    user.block.splice(blockedUserIndex, 1);
    await user.save();

    // Populate data for the blocked user
    const unblockedUser = await User.find()
      .sort({ date: -1 })
      .populate("block.userID");

    return res.status(200).json({
      message: "User unblocked successfully",
      unblockedUser: unblockedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

// Deactivate user account
const deactivateAccount = asyncHandler(async (req, res) => {
  const { userID } = req.body;

  try {
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user account is already deactivated
    if (user.accountStatus === "deactive") {
      return res
        .status(400)
        .json({ message: "User account is already deactivated" });
    }

    // Deactivate the user account and set the deactivation timestamp
    user.accountStatus = "deactive";
    user.deactivatedAt = new Date();
    await user.save();

    // You may want to perform additional actions here, such as logging out the user, etc.

    return res.status(200).json({
      message: "User account deactivated successfully",
      // deactivatedUser: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error. Try again later" });
  }
});

module.exports = {
  registerUser,
  loginUser,
  updateLoginUser,
  getUserProfile,
  getProfileInfo,
  updatePassword,
  getAllUsers,
  sendEmailOTP,
  verifyEmailOTP,
  sendForgotPasswordOTP,
  verifyForgetPasswordOTP,
  resetPassword,
  addPreferences,
  addFavoriteGames,
  report,
  updateProfile,
  addFollowers,
  removeFollower,
  removeFollowing,
  blockUser,
  unblockUser,
  deactivateAccount,
};
