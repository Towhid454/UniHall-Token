const HallFee = require("../models/HallFee.model");
const Wallet = require("../models/Wallet.model");
const Transaction = require("../models/Transaction.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/hall-admin/fees — hallAdmin creates a fee for a student
const createHallFee = asyncHandler(async (req, res) => {
  const { studentId, title, totalAmount, dueDate } = req.body;

  if (!studentId || !title || !totalAmount) {
    throw new ApiError(400, "studentId, title, totalAmount are required");
  }

  const fee = await HallFee.create({
    student: studentId,
    hall: req.user.hall,
    title,
    totalAmount,
    dueDate,
  });

  return res.status(201).json(new ApiResponse(201, fee, "Hall fee created"));
});

// GET /api/hall-admin/fees — hallAdmin lists all fees for their hall
const getHallFees = asyncHandler(async (req, res) => {
  const fees = await HallFee.find({ hall: req.user.hall })
    .populate("student", "name email studentId")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, fees, "Hall fees fetched"));
});

// GET /api/hall-fee/me — student sees own fee(s)
const getMyHallFee = asyncHandler(async (req, res) => {
  const fees = await HallFee.find({ student: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, fees, "Your hall fee fetched"));
});

// POST /api/hall-fee/pay — student pays a fee from wallet
const payHallFee = asyncHandler(async (req, res) => {
  const { feeId, amount } = req.body;

  if (!feeId || !amount)
    throw new ApiError(400, "feeId and amount are required");

  const fee = await HallFee.findOne({ _id: feeId, student: req.user._id });
  if (!fee) throw new ApiError(404, "Fee not found");

  const dueAmount = fee.totalAmount - fee.paidAmount;
  if (amount > dueAmount) {
    throw new ApiError(400, `Amount exceeds due amount (৳${dueAmount})`);
  }

  const wallet = await Wallet.findOne({ student: req.user._id });
  if (!wallet) throw new ApiError(400, "Wallet not found");
  if (wallet.balance < amount)
    throw new ApiError(400, "Insufficient wallet balance");

  wallet.balance -= amount;
  await wallet.save();

  fee.paidAmount += amount;
  fee.status = fee.paidAmount >= fee.totalAmount ? "paid" : "partial";
  await fee.save();

  await Transaction.create({
    wallet: wallet._id,
    student: req.user._id,
    hall: req.user.hall,
    type: "debit",
    amount,
    description: `Hall fee payment: ${fee.title}`,
    reference: fee._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, fee, "Fee payment successful"));
});

module.exports = { createHallFee, getHallFees, getMyHallFee, payHallFee };
