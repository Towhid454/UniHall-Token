const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    totalRooms: { type: Number, default: 0 },
    provostName: { type: String, default: "" },
    address: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true },
);

// same university can't have duplicate hall codes
hallSchema.index({ university: 1, code: 1 }, { unique: true });

module.exports = mongoose.model("Hall", hallSchema);
