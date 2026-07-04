const express = require("express");
const router = express.Router();
const {
  getAllUniversities,
  getHallsByUniversity,
  createUniversity,
  createHall,
} = require("../controllers/university.controller");

// Public routes — used by signup form dropdowns
router.get("/", getAllUniversities);
router.get("/:id/halls", getHallsByUniversity);

// Protected routes — auth middleware added in Step 5
router.post("/", createUniversity);
router.post("/:id/halls", createHall);

module.exports = router;
