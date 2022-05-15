import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";
import { NotFoundError } from "../utils/errorResponse.js";

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    taxPrice,
    shippingPrice,
    user,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new NotFoundError("No order items"));
  }

  const order = new Order({
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    taxPrice,
    shippingPrice,
    user,
  });

  const createdOrder = await order.save();

  res.status(201).json({ success: true, createdOrder });
});

// @desc    Get order by id
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: "user",
    select: "name email",
  });

  if (!order) {
    return next(new NotFoundError("Order not found"));
  }

  res.status(200).json({ success: true, order });
});
