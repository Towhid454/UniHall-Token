const express = require("express");
const router = express.Router();
const {
  getRoomsInMyHall,
  requestRoom,
  getMyAllotments,
  getAllotmentRequests,
  reviewAllotment,
  createRoom,
} = require("../controllers/room.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// All routes require login
router.use(protect);

// Student routes
router.get("/", restrictTo("student"), getRoomsInMyHall);
router.post("/allotments", restrictTo("student"), requestRoom);
router.get("/allotments/my", restrictTo("student"), getMyAllotments);

// Hall Admin routes
router.post("/", restrictTo("hallAdmin"), createRoom);
router.get("/allotments", restrictTo("hallAdmin"), getAllotmentRequests);
router.patch("/allotments/:id", restrictTo("hallAdmin"), reviewAllotment);

module.exports = router;
