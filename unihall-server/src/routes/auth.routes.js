const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  refreshAccessToken,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", protect, getMe);

module.exports = router;
