const express = require("express");
const router = express.Router();
const {
  getAllUniversities,
  getHallsByUniversity,
  createUniversity,
  createHall,
} = require("../controllers/university.controller");

// Import the auth middlewares
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// Public routes — used by signup form dropdowns
router.get("/", getAllUniversities);
router.get("/:id/halls", getHallsByUniversity);

// Protected routes — Now actually protected!
router.post("/", protect, restrictTo("superAdmin"), createUniversity);
router.post("/:id/halls", protect, restrictTo("universityAdmin"), createHall);

module.exports = router;
