const Feedback = require("../models/Feedback.model");
const SupportTicket = require("../models/SupportTicket.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// ─── FEEDBACK ─────────────────────────────────────────────

// POST /api/feedback — student submits feedback
const submitFeedback = asyncHandler(async (req, res) => {
  const { category, message, rating } = req.body;

  if (!category || !message) {
    throw new ApiError(400, "category and message are required");
  }

  const feedback = await Feedback.create({
    student: req.user._id,
    hall: req.user.hall,
    category,
    message,
    rating,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, feedback, "Feedback submitted"));
});

// GET /api/feedback/my — student sees own feedback
const getMyFeedback = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { student: req.user._id };
  if (category) filter.category = category;

  const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, feedbacks, "Your feedback fetched"));
});

// GET /api/feedback — hallAdmin sees all feedback for their hall
const getHallFeedback = asyncHandler(async (req, res) => {
  const { category, status } = req.query;
  const filter = { hall: req.user.hall };
  if (category) filter.category = category;
  if (status) filter.status = status;

  const feedbacks = await Feedback.find(filter)
    .populate("student", "name email studentId")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, feedbacks, "Feedback list fetched"));
});

// GET /api/feedback/stats — hallAdmin sees stats for their hall
const getFeedbackStats = asyncHandler(async (req, res) => {
  const hallId = req.user.hall;

  const [feedbackStats, ticketStats] = await Promise.all([
    Feedback.aggregate([
      { $match: { hall: hallId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]),
    SupportTicket.aggregate([
      { $match: { hall: hallId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  // Compute avg resolution time for tickets
  const resolvedTickets = await SupportTicket.find({
    hall: hallId,
    status: "resolved",
    resolvedAt: { $exists: true },
  }).select("createdAt resolvedAt");

  let avgResolutionTimeHours = 0;
  if (resolvedTickets.length > 0) {
    const totalMs = resolvedTickets.reduce((sum, t) => {
      return sum + (new Date(t.resolvedAt) - new Date(t.createdAt));
    }, 0);
    avgResolutionTimeHours = (
      totalMs /
      resolvedTickets.length /
      (1000 * 60 * 60)
    ).toFixed(1);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        feedback: feedbackStats,
        tickets: ticketStats,
        avgResolutionTimeHours: Number(avgResolutionTimeHours),
      },
      "Stats fetched",
    ),
  );
});

// ─── SUPPORT TICKETS ──────────────────────────────────────

// POST /api/support/tickets — student creates a ticket
const createTicket = asyncHandler(async (req, res) => {
  const { subject, description } = req.body;

  if (!subject || !description) {
    throw new ApiError(400, "subject and description are required");
  }

  const ticket = await SupportTicket.create({
    student: req.user._id,
    hall: req.user.hall,
    subject,
    description,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, ticket, "Support ticket created"));
});

// GET /api/support/tickets/my — student sees own tickets
const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({ student: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tickets, "Your tickets fetched"));
});

// GET /api/support/tickets — hallAdmin sees all tickets for their hall
const getHallTickets = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { hall: req.user.hall };
  if (status) filter.status = status;

  const tickets = await SupportTicket.find(filter)
    .populate("student", "name email studentId")
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tickets, "Hall tickets fetched"));
});

// PATCH /api/support/tickets/:id — hallAdmin updates/resolves a ticket
const updateTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, resolutionNote } = req.body;

  if (!["pending", "in_progress", "resolved"].includes(status)) {
    throw new ApiError(400, "status must be pending | in_progress | resolved");
  }

  const ticket = await SupportTicket.findOne({
    _id: id,
    hall: req.user.hall,
  });
  if (!ticket) throw new ApiError(404, "Ticket not found");

  ticket.status = status;
  ticket.assignedTo = req.user._id;
  if (resolutionNote) ticket.resolutionNote = resolutionNote;
  if (status === "resolved") ticket.resolvedAt = new Date();

  await ticket.save();

  return res.status(200).json(new ApiResponse(200, ticket, `Ticket ${status}`));
});

module.exports = {
  submitFeedback,
  getMyFeedback,
  getHallFeedback,
  getFeedbackStats,
  createTicket,
  getMyTickets,
  getHallTickets,
  updateTicket,
};
