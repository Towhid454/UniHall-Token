const User = require("../models/User.model");
const University = require("../models/University.model");
const Hall = require("../models/Hall.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const generateAccessAndRefreshTokens = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

// POST /api/auth/signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, universityId, hallId } = req.body;

  if (!name || !email || !password || !universityId || !hallId) {
    throw new ApiError(400, "All fields are required");
  }

  // Validate university exists
  const university = await University.findById(universityId);
  if (!university) throw new ApiError(404, "University not found");

  // Validate email domain matches university
  const emailDomain = email.split("@")[1];
  if (emailDomain !== university.emailDomain) {
    throw new ApiError(
      400,
      `Email must be from @${university.emailDomain} domain`,
    );
  }

  // Validate hall belongs to university
  const hall = await Hall.findOne({ _id: hallId, university: universityId });
  if (!hall) throw new ApiError(404, "Hall not found under this university");

  // Check duplicate email
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "Email already registered");

  const user = await User.create({
    name,
    email,
    password,
    university: universityId,
    hall: hallId,
    role: "student",
  });

  const created = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(201)
    .json(new ApiResponse(201, created, "Account created successfully"));
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email })
    .populate("university", "name code")
    .populate("hall", "name code");
  if (!user) throw new ApiError(401, "Invalid credentials");

  if (user.status !== "active") {
    throw new ApiError(403, "Account is inactive or suspended");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("university", "name code")
    .populate("hall", "name code");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Login successful",
      ),
    );
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true },
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logout successful"));
});

// POST /api/auth/refresh-token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized");

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.JWT_REFRESH_SECRET,
  );

  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed"),
    );
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -refreshToken")
    .populate("university", "name code emailDomain logoUrl")
    .populate("hall", "name code provostName");

  return res.status(200).json(new ApiResponse(200, user, "User profile"));
});

module.exports = { signup, login, logout, refreshAccessToken, getMe };
