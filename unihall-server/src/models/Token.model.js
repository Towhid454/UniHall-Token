const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
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
    diningPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiningPlan",
      required: true,
    },
    date: { type: Date, required: true },
    mealType: {
      type: String,
      enum: ["lunch", "dinner"],
      required: true,
    },
    qrPayload: { type: String, required: true, unique: true },
    qrImage: { type: String },
    status: {
      type: String,
      enum: ["active", "used", "expired"],
      default: "active",
    },
    usedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Token", tokenSchema);
