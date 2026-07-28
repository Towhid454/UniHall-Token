const mongoose = require("mongoose");

const hallFeeSchema = new mongoose.Schema(
  {
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
    title: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("HallFee", hallFeeSchema);
