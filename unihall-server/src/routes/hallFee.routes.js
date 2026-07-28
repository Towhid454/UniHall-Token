const express = require("express");
const router = express.Router();
const {
  createHallFee,
  getHallFees,
  getMyHallFee,
  payHallFee,
} = require("../controllers/hallFee.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

router.use(protect);

// Student
router.get("/hall-fee/me", restrictTo("student"), getMyHallFee);
router.post("/hall-fee/pay", restrictTo("student"), payHallFee);

// Hall Admin
router.post("/hall-admin/fees", restrictTo("hallAdmin"), createHallFee);
router.get("/hall-admin/fees", restrictTo("hallAdmin"), getHallFees);

module.exports = router;
