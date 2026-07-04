const mongoose = require("mongoose");

const diningPlanSchema = new mongoose.Schema(
  {
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    mealsPerDay: {
      lunch: { type: Boolean, default: true },
      dinner: { type: Boolean, default: true },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DiningPlan", diningPlanSchema);
