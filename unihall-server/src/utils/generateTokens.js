const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      university: user.university,
      hall: user.hall,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
  );

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

module.exports = generateAccessAndRefreshTokens;
