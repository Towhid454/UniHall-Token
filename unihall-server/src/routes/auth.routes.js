const express = require("express");
const router = express.Router();
const {
  signup,
  verifyEmail,
  resendVerification,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);

module.exports = router;