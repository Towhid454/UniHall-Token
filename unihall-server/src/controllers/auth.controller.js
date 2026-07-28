const crypto = require("crypto");
const User = require("../models/User.model");
const University = require("../models/University.model");
const Hall = require("../models/Hall.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const generateAccessAndRefreshTokens = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../services/email.service");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const SAFE_SELECT =
  "-password -refreshToken -emailVerificationToken -passwordResetToken";

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

// Generate a random token + its SHA-256 hash (only the hash is stored in DB)
const generateHashedToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, hashedToken };
};

const getVerifyUrl = (rawToken) => {
  const backendUrl = (process.env.BACKEND_URL || "").replace(/\/$/, "");
  if (backendUrl) {
    return `${backendUrl}/api/auth/verify-email?token=${rawToken}`;
  }

  const clientUrl = (process.env.CLIENT_URL || "").replace(/\/$/, "");
  if (clientUrl) {
    return `${clientUrl}/verify-email?token=${rawToken}`;
  }

  return `http://localhost:5000/api/auth/verify-email?token=${rawToken}`;
};

// POST /api/auth/signup
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, universityId, hallId } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!name || !normalizedEmail || !password || !universityId || !hallId) {
    throw new ApiError(400, "All fields are required");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const university = await University.findById(universityId);
  if (!university) throw new ApiError(404, "University not found");

  const emailDomain = normalizedEmail.split("@")[1];
  if (emailDomain !== university.emailDomain) {
    throw new ApiError(
      400,
      `Email must be from @${university.emailDomain} domain`,
    );
  }

  const hall = await Hall.findOne({ _id: hallId, university: universityId });
  if (!hall) throw new ApiError(404, "Hall not found under this university");

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) throw new ApiError(409, "Email already registered");

  const { rawToken, hashedToken } = generateHashedToken();

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    university: universityId,
    hall: hallId,
    role: "student",
    emailVerified: false,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  const verifyUrl = getVerifyUrl(rawToken);
  await sendVerificationEmail(user.email, user.name, verifyUrl);

  const created = await User.findById(user._id).select(SAFE_SELECT);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        created,
        "Account created. Please check your email to verify your account before signing in.",
      ),
    );
});

// POST|GET /api/auth/verify-email
const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.body?.token || req.query?.token;
  if (!token) throw new ApiError(400, "Verification token is required");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Verification link is invalid or has expired");
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  if (req.method === "GET") {
    return res.status(200).send(`
      <html>
        <head><title>Email Verified</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <h2>Email verified successfully</h2>
          <p>Your account is now verified. You can return to the app and log in.</p>
        </body>
      </html>
    `);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

// POST /api/auth/resend-verification
const resendVerification = asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body?.email);
  if (!normalizedEmail) throw new ApiError(400, "Email is required");

  const genericMessage =
    "If an unverified account exists for this email, a new verification link has been sent";

  const user = await User.findOne({ email: normalizedEmail });

  // Don't reveal whether the account exists or is already verified
  if (!user || user.emailVerified) {
    return res.status(200).json(new ApiResponse(200, {}, genericMessage));
  }

  const { rawToken, hashedToken } = generateHashedToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const verifyUrl = getVerifyUrl(rawToken);
  await sendVerificationEmail(user.email, user.name, verifyUrl);

  return res.status(200).json(new ApiResponse(200, {}, genericMessage));
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const normalizedEmail = normalizeEmail(req.body?.email);

  if (!normalizedEmail || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: normalizedEmail })
    .populate("university", "name shortName code")
    .populate("hall", "name code");
  if (!user) throw new ApiError(401, "Invalid credentials");

  if (user.status !== "active") {
    throw new ApiError(403, "Account is inactive or suspended");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  if (!user.emailVerified) {
    const { rawToken, hashedToken } = generateHashedToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const verifyUrl = getVerifyUrl(rawToken);
    await sendVerificationEmail(user.email, user.name, verifyUrl);

    throw new ApiError(
      403,
      "Please verify your email before logging in. A new verification email has been sent.",
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id)
    .select(SAFE_SELECT)
    .populate("university", "name shortName code")
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

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body?.email);
  if (!normalizedEmail) throw new ApiError(400, "Email is required");

  const genericMessage =
    "If an account exists for this email, a password reset link has been sent";

  const user = await User.findOne({ email: normalizedEmail });

  // Don't reveal whether the account exists (prevents email enumeration)
  if (!user) {
    return res.status(200).json(new ApiResponse(200, {}, genericMessage));
  }

  const { rawToken, hashedToken } = generateHashedToken();
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
  await sendPasswordResetEmail(user.email, user.name, resetUrl);

  return res.status(200).json(new ApiResponse(200, {}, genericMessage));
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new ApiError(400, "Token and new password are required");
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Reset link is invalid or has expired");

  user.password = newPassword; // pre-save hook re-hashes this automatically
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined; // force re-login on all devices for security
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset successful. Please sign in with your new password.",
      ),
    );
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select(SAFE_SELECT)
    .populate("university", "name shortName code emailDomain logoUrl")
    .populate("hall", "name code provostName");

  return res.status(200).json(new ApiResponse(200, user, "User profile"));
});

module.exports = {
  signup,
  verifyEmail,
  resendVerification,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  getMe,
};