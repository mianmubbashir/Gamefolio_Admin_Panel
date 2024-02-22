const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const userController = require("../controller/userController");

const router = express.Router();

router.post("/signup", userController.registerUser);
router.put("/profile/update", userController.updateProfile);
router.post("/preferences/create", userController.addPreferences);
router.post("/favorite-games/create", userController.addFavoriteGames);
router.post("/signup", userController.registerUser);

// router.post("/signup/emailotp/sent", userController.sendEmailOTP);
// router.post("/signup/emailotp/verify", userController.verifyEmailOTP);

router.post("/signin", userController.loginUser);
router.put("/password/update", userController.updatePassword);
router.get("/updatesignin", authMiddleware, userController.updateLoginUser);
// router.route("/profile").get(protect, userController.getUserProfile);
router.post("/getUser", userController.getUserProfile);
router.post("/profile/get", userController.getProfileInfo);
router.get("/getAllUsers", userController.getAllUsers);
router.post("/deactivate", userController.deactivateAccount);

//followers
router.post("/follower/create", userController.addFollowers);
router.post("/follower/delete", userController.removeFollower);
router.post("/following/delete", userController.removeFollowing);

router.post("/block/create", userController.blockUser);
router.post("/block/delete", userController.unblockUser);

router.post("/report/create", userController.report);

// forget password otp
router.post("/forgot-password/otp", userController.sendForgotPasswordOTP);
router.post(
  "/forgot-password/otp/verify",
  userController.verifyForgetPasswordOTP
);
router.post("/reset-password", userController.resetPassword);

module.exports = router;
