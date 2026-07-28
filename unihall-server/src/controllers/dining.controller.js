const DiningPlan = require("../models/DiningPlan.model");
const Token = require("../models/Token.model");
const Wallet = require("../models/Wallet.model");
const Transaction = require("../models/Transaction.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const {
  generateQRPayload,
  generateQRImage,
} = require("../services/qr.service");

// ─── HALL ADMIN ──────────────────────────────────────────

// POST /api/dining/plans — hallAdmin creates a dining plan
const createDiningPlan = asyncHandler(async (req, res) => {
  const { name, description, price, durationDays, mealsPerDay } = req.body;

  if (!name || !price || !durationDays) {
    throw new ApiError(400, "name, price, durationDays are required");
  }

  const plan = await DiningPlan.create({
    hall: req.user.hall,
    name,
    description,
    price,
    durationDays,
    mealsPerDay,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, plan, "Dining plan created"));
});

// ─── STUDENT ─────────────────────────────────────────────

// GET /api/dining/plans — student sees available plans for their hall
const getDiningPlans = asyncHandler(async (req, res) => {
  const plans = await DiningPlan.find({
    hall: req.user.hall,
    status: "active",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, plans, "Dining plans fetched"));
});
// GET /api/dining/hall-plans — hallAdmin sees ALL plans for their hall (any status)
const getHallDiningPlans = asyncHandler(async (req, res) => {
  const plans = await DiningPlan.find({ hall: req.user.hall }).sort(
    "-createdAt",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, plans, "Hall dining plans fetched"));
});

// POST /api/dining/purchase — student purchases a dining plan
const purchaseDiningPlan = asyncHandler(async (req, res) => {
  const { planId } = req.body;

  if (!planId) throw new ApiError(400, "planId is required");

  const plan = await DiningPlan.findOne({
    _id: planId,
    hall: req.user.hall,
    status: "active",
  });
  if (!plan) throw new ApiError(404, "Dining plan not found");

  // Check wallet balance
  let wallet = await Wallet.findOne({ student: req.user._id });
  if (!wallet) {
    wallet = await Wallet.create({
      student: req.user._id,
      hall: req.user.hall,
      balance: 0,
    });
  }

  if (wallet.balance < plan.price) {
    throw new ApiError(
      400,
      `Insufficient balance. Need ৳${plan.price}, have ৳${wallet.balance}`,
    );
  }

  // Deduct from wallet
  wallet.balance -= plan.price;
  await wallet.save();

  // Record transaction
  await Transaction.create({
    wallet: wallet._id,
    student: req.user._id,
    hall: req.user.hall,
    type: "debit",
    amount: plan.price,
    description: `Purchased dining plan: ${plan.name}`,
    reference: planId,
  });

  // Auto-generate tokens for each day + meal
  const tokens = [];
  const startDate = new Date();

  for (let day = 0; day < plan.durationDays; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split("T")[0];

    const mealTypes = [];
    if (plan.mealsPerDay?.lunch) mealTypes.push("lunch");
    if (plan.mealsPerDay?.dinner) mealTypes.push("dinner");

    for (const mealType of mealTypes) {
      const qrPayload = generateQRPayload(
        req.user._id.toString(),
        req.user.hall.toString(),
        dateStr,
        mealType,
      );

      const qrImage = await generateQRImage(qrPayload);

      tokens.push({
        student: req.user._id,
        hall: req.user.hall,
        diningPlan: planId,
        date,
        mealType,
        qrPayload,
        qrImage,
        status: "active",
      });
    }
  }

  const createdTokens = await Token.insertMany(tokens);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        tokensGenerated: createdTokens.length,
        walletBalance: wallet.balance,
        plan: plan.name,
      },
      "Dining plan purchased, tokens generated",
    ),
  );
});

// GET /api/dining/tokens — student's tokens (today's by default)
const getMyTokens = asyncHandler(async (req, res) => {
  const { date } = req.query;

  const filter = {
    student: req.user._id,
    hall: req.user.hall,
  };

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  } else {
    // Today's tokens by default
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  const tokens = await Token.find(filter)
    .populate("diningPlan", "name")
    .sort("mealType");

  return res.status(200).json(new ApiResponse(200, tokens, "Tokens fetched"));
});

// ─── HALL ADMIN — SCAN ───────────────────────────────────

// POST /api/dining/scan — hallAdmin scans QR to verify token
const scanToken = asyncHandler(async (req, res) => {
  const { qrPayload } = req.body;

  if (!qrPayload) throw new ApiError(400, "qrPayload is required");

  const token = await Token.findOne({
    qrPayload,
    hall: req.user.hall,
  }).populate("student", "name email studentId");

  if (!token) throw new ApiError(404, "Invalid QR code");

  if (token.status === "used") {
    throw new ApiError(400, `Token already used at ${token.usedAt}`);
  }

  if (token.status === "expired") {
    throw new ApiError(400, "Token has expired");
  }

  // Check if token date matches today
  const today = new Date();
  const tokenDate = new Date(token.date);
  if (
    today.getDate() !== tokenDate.getDate() ||
    today.getMonth() !== tokenDate.getMonth() ||
    today.getFullYear() !== tokenDate.getFullYear()
  ) {
    throw new ApiError(400, "Token is not valid for today");
  }

  // Mark as used
  token.status = "used";
  token.usedAt = new Date();
  await token.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        student: token.student,
        mealType: token.mealType,
        date: token.date,
        usedAt: token.usedAt,
      },
      "Token verified successfully ✅",
    ),
  );
});

module.exports = {
  createDiningPlan,
  getDiningPlans,
  purchaseDiningPlan,
  getMyTokens,
  scanToken,
  getHallDiningPlans,
};
