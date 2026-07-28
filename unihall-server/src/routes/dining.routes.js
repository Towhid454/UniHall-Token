const express = require("express");
const router = express.Router();
const {
  createDiningPlan,
  getDiningPlans,
  getHallDiningPlans,
  purchaseDiningPlan,
  getMyTokens,
  scanToken,
} = require("../controllers/dining.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

router.use(protect);

// Student routes
router.get("/plans", restrictTo("student"), getDiningPlans);
router.post("/purchase", restrictTo("student"), purchaseDiningPlan);
router.get("/tokens", restrictTo("student"), getMyTokens);

// Hall Admin routes
router.post("/plans", restrictTo("hallAdmin"), createDiningPlan);
router.get("/hall-plans", restrictTo("hallAdmin"), getHallDiningPlans);
router.post("/scan", restrictTo("hallAdmin"), scanToken);

module.exports = router;
