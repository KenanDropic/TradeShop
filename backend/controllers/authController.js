import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import {
  BadRequestError,
  ErrorResponse,
  NotFoundError,
  UnAuthenticatedError,
} from "../utils/errorResponse.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new BadRequestError("Please provide all values"), 400);
  }

  const doesUserExist = await User.findOne({ email });

  if (doesUserExist) {
    return next(new BadRequestError("User already exists"), 400);
  }

  const user = await new User(req.body);

  const verificationToken = user.generateVerificationToken();

  // frontend url. When user hits this url,we will make request from frontend to backend url(/api/v1/auth/confirmEmail?token=...) to confirm email.
  const url = `${req.protocol}://tradeshop-mern.herokuapp.com/confirmEmail?token=${verificationToken}`; // - prod mode
  // const url = `${req.protocol}://localhost:3000/confirmEmail?token=${verificationToken}`; - dev mode

  user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Email confirmation token",
      html: `<h4>${user.name},hvala što ste se registrovali na naš sajt.</h4> Kliknite ovdje <a href="${url}"<a/>da potvrdite vaš email.`,
    });
  } catch (error) {
    console.log(error);

    console.log(url);

    user.confirmEmailToken = undefined;
    user.confirmEmailExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent"));
  }

  sendTokenResponse(user, 201, res, `Email sent to ${user.email}`);
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

  if (!user.isEmailConfirmed) {
    return next(new UnAuthenticatedError("Please confirm your email to login"));
  }

  const doesMatch = await user.matchPasswords(password);

  if (!doesMatch) {
    return next(
      new UnAuthenticatedError("Not authorized to access this route")
    );
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Update logged user
// @route   PUT /api/v1/auth/profile
// @access  Public
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  if (!email || !name) {
    return next(new BadRequestError("Please provide all values"));
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  user.name = name;
  user.email = email;

  const updatedUser = await user.save();

  res.status(200).json({ success: true, updatedUser });
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
    role: currentUser.role,
    isEmailConfirmed: currentUser.isEmailConfirmed,
  };

  res.status(200).json({ success: true, user: currentUserCopy });
});

// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    return next(new NotFoundError("User not found"));
  }

  res.status(200).json({ success: true });
});

// @desc    Verfiy Account
// @route   GET /api/v1/auth/confirmEmail
// @access  Public
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(new BadRequestError("Invalid token"));
  }

  const splitToken = token.split(".")[0];

  // Get hashed token
  const confirmEmailToken = crypto
    .createHash("sha256")
    .update(splitToken)
    .digest("hex");

  const user = await User.findOne({
    confirmEmailToken,
    confirmEmailExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new BadRequestError("Invalid token"));
  }

  // set isVerified to true
  user.isEmailConfirmed = true;
  user.confirmEmailToken = undefined;
  user.confirmEmailExpire = undefined;

  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// send token as response
const sendTokenResponse = (user, statusCode, response, msg) => {
  const token = user.getSignedJWT();

  response
    .status(statusCode)
    .json({ success: true, token, message: msg !== "" ? msg : undefined });
};
