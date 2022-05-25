import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { BadRequestError, NotFoundError } from "../utils/errorResponse.js";

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/ADMIN
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advRes);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/ADMIN
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  res.status(200).json({ success: true, user });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/ADMIN
export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, updatedUser });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/ADMIN
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  await user.remove();

  res.status(200).json({ success: true, data: {} });
});
