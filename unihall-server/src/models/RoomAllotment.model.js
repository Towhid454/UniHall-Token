const mongoose = require("mongoose");

const roomAllotmentSchema = new mongoose.Schema(
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
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    requestType: {
      type: String,
      enum: ["new", "change", "cancel"],
      required: true,
    },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewNote: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RoomAllotment", roomAllotmentSchema);
