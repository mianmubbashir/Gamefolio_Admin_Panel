const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const adminController = require("../controller/adminController.js");
const userController = require("../controller/userController.js");

const router = express.Router();

router.post("/signup", adminController.registerUser);
router.put("/profile/update", adminController.updateProfile);
router.post("/signup", adminController.registerUser);

router.post("/signin", adminController.loginUser);
router.put("/password/update", adminController.updatePassword);
router.get("/updatesignin", authMiddleware, adminController.updateLoginUser);
// router.route("/profile").get(protect, adminController.getUserProfile);
router.post("/getUser", authMiddleware, userController.getUserProfile);
router.post("/profile/get", adminController.getProfileInfo);
router.post("/getAllUsers", authMiddleware, userController.getAllUsers);
router.post("/deactivate", adminController.deactivateAccount);

router.post("/report/create", adminController.report);

// forget password otp
router.post("/forgot-password/otp", adminController.sendForgotPasswordOTP);
router.post(
  "/forgot-password/otp/verify",
  adminController.verifyForgetPasswordOTP
);
router.post("/reset-password", adminController.resetPassword);

module.exports = router;
