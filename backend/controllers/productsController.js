import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  if (!products) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ success: true, data: products });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).json({ msg: "Product not found" });
  }

  res.status(200).json({ success: true, data: product });
});
