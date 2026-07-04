const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "debit"],
      required: true,
    },
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    reference: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
