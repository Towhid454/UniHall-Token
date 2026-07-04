const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/student.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// All student routes are protected
router.use(protect);
router.use(restrictTo("student"));

router.get("/me", getMyProfile);
router.patch("/me", updateMyProfile);

module.exports = router;
