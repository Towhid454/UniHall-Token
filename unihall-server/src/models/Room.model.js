const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },
    roomNumber: { type: String, required: true, trim: true },
    floor: { type: String, default: "" },
    capacity: { type: Number, required: true, default: 2 },
    occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    type: {
      type: String,
      enum: ["single", "double", "triple", "quad"],
      default: "double",
    },
    status: {
      type: String,
      enum: ["available", "full", "maintenance"],
      default: "available",
    },
  },
  { timestamps: true },
);

// unique room number per hall
roomSchema.index({ hall: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model("Room", roomSchema);
