import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";
import { NotFoundError } from "../utils/errorResponse.js";
import Review from "../models/Review.js";

// @desc    Get Product Reviews
// @route   GET /api/v1/products/:id/reviews
// @access  Private
export const getProductReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new NotFoundError("Product not found"));
  }

  const reviews = await Review.find({ product: req.params.id });

  if (!reviews) {
    return next(new NotFoundError("No reviews for this product"));
  }

  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc    Create New Review
// @route   POST /api/v1/products/:id/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.product = req.params.id;
  req.body.name = req.user.name;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new NotFoundError("Product not found"));
  }

  const review = await Review.create(req.body);

  res.status(200).json({ success: true, review });
});

// @desc    Delete Review
// @route   DELETE /api/v1/reviews/:id
// @access  Private or Admin
export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new NotFoundError("Review not found"));
  }

  await review.remove();

  res.status(200).json({ success: true, data: {} });
});
