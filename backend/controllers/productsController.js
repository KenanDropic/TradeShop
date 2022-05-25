import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";
import { NotFoundError } from "../utils/errorResponse.js";

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advRes);
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new NotFoundError("Product not found"));
  }

  res.status(200).json({ success: true, product });
});

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private/ADMIN
export const createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create({
    ...req.body,
    user: req.user.id,
    numReviews: 0,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/ADMIN
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new NotFoundError("Product not found"));
  }

  product.name = name;
  product.price = price;
  product.description = description;
  product.image = image;
  product.brand = brand;
  product.category = category;
  product.countInStock = countInStock;

  const updatedProduct = await product.save();

  res.status(200).json({ success: true, updatedProduct });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/ADMIN
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new NotFoundError("Product not found"));
  }

  await product.remove();

  res.status(200).json({ success: true, data: {} });
});
