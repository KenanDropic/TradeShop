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

  const token = user.getSignedJWT();

  res.status(200).json({ success: true, token });
});

// @desc    Get current user
// @route   GET /api/v1/auth/profile
// @access  Private
export const getLoggedUser = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // removing __v property
  const currentUserCopy = {
    _id: currentUser._id,
    name: currentUser.name,
    email: currentUser.email,
    isAdmin: currentUser.isAdmin,
  };

  res.status(200).json({ success: true, user: currentUserCopy });
});
