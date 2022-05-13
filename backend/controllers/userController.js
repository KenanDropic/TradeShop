import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../utils/errorResponse.js";

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new BadRequestError("Please provide all values"), 400);
  }

  const doesUserExist = await User.findOne({ email });

  if (doesUserExist) {
    return next(new BadRequestError("User already exists"), 400);
  }

  const user = await User.create(req.body);

  sendTokenResponse(user, 201, res);
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Please provide all values"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  const doesMatch = await user.matchPasswords(password);

  if (!doesMatch) {
    return next(
      new UnAuthenticatedError("Not authorized to access this route")
    );
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current user
// @route   GET /api/v1/auth/profile
// @access  Private
export const getLoggedUser = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    return next(new NotFoundError("User not found"));
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

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    runValidators: true,
    new: true,
  });

  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  res.status(200).json({ success: true, user });
});

// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    return next(new NotFoundError("User not found"));
  }

  res.status(200).json({ success: true, user: currentUserCopy });
});

// send token as response
const sendTokenResponse = (user, statusCode, response) => {
  const token = user.getSignedJWT();

  response.status(statusCode).json({ success: true, token });
};
