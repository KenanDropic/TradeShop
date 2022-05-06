import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// @desc    Create User
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create(req.body);

  res.status(200).json({ success: true });
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(404);
    throw new Error("Please provide all values");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const doesMatch = await user.matchPasswords(password);

  if (!doesMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.status(200).json({ success: true });
});

// @desc    Get current user
// @route   POST /api/v1/auth/current
// @access  Public
export const getLoggedUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
