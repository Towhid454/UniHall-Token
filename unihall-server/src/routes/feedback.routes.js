const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getMyFeedback,
  getHallFeedback,
  getFeedbackStats,
  createTicket,
  getMyTickets,
  getHallTickets,
  updateTicket,
} = require("../controllers/feedback.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

router.use(protect);

// Feedback
router.post("/feedback", restrictTo("student"), submitFeedback);
router.get("/feedback/my", restrictTo("student"), getMyFeedback);
router.get("/feedback", restrictTo("hallAdmin"), getHallFeedback);
router.get("/feedback/stats", restrictTo("hallAdmin"), getFeedbackStats);

// Support Tickets
router.post("/support/tickets", restrictTo("student"), createTicket);
router.get("/support/tickets/my", restrictTo("student"), getMyTickets);
router.get("/support/tickets", restrictTo("hallAdmin"), getHallTickets);
router.patch("/support/tickets/:id", restrictTo("hallAdmin"), updateTicket);

module.exports = router;
