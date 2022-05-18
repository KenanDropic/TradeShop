import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { BadRequestError, NotFoundError } from "../utils/errorResponse.js";

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/ADMIN
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  if (!users) {
    return next(new NotFoundError("User not found"));
  }

  res.status(200).json({ success: true, users });
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
