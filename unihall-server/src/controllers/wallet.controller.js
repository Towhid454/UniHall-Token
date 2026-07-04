const Wallet = require("../models/Wallet.model");
const Transaction = require("../models/Transaction.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/wallet/me — student sees balance + transaction history
const getMyWallet = asyncHandler(async (req, res) => {
  let wallet = await Wallet.findOne({ student: req.user._id });

  // Auto-create wallet if not exists
  if (!wallet) {
    wallet = await Wallet.create({
      student: req.user._id,
      hall: req.user.hall,
      balance: 0,
    });
  }

  const transactions = await Transaction.find({ student: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  return res
    .status(200)
    .json(new ApiResponse(200, { wallet, transactions }, "Wallet fetched"));
});

// POST /api/wallet/deposit — add money to wallet
const deposit = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    throw new ApiError(400, "amount must be a positive number");
  }

  let wallet = await Wallet.findOne({ student: req.user._id });

  if (!wallet) {
    wallet = await Wallet.create({
      student: req.user._id,
      hall: req.user.hall,
      balance: 0,
    });
  }

  wallet.balance += Number(amount);
  await wallet.save();

  await Transaction.create({
    wallet: wallet._id,
    student: req.user._id,
    hall: req.user.hall,
    type: "deposit",
    amount: Number(amount),
    description: "Wallet top-up",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { balance: wallet.balance },
        `৳${amount} deposited successfully`,
      ),
    );
});

module.exports = { getMyWallet, deposit };
