const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Wallet", walletSchema);
