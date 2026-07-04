const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/students/me
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -refreshToken")
    .populate("university", "name shortName code emailDomain logoUrl")
    .populate("hall", "name code provostName address");

  return res.status(200).json(new ApiResponse(200, user, "Profile fetched"));
});

// PATCH /api/students/me
const updateMyProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "name",
    "phone",
    "studentId",
    "department",
    "batch",
    "session",
    "program",
    "gender",
    "dob",
    "bloodGroup",
    "religion",
    "nationality",
    "nationalId",
    "avatarUrl",
    "presentAddress",
    "permanentAddress",
  ];

  // Build update object with only allowed fields
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided to update");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true },
  )
    .select("-password -refreshToken")
    .populate("university", "name shortName code emailDomain logoUrl")
    .populate("hall", "name code provostName address");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated"));
});

module.exports = { getMyProfile, updateMyProfile };
