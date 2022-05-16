import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";
import { NotFoundError, UnAuthenticatedError } from "../utils/errorResponse.js";

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

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id
// @access  Private/Admin Only
export const updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new NotFoundError("Order not found"));
  }

  if (req.user.isAdmin !== true) {
    return next(
      new UnAuthenticatedError(
        `User ${req.user.id} is not authorized to update order ${order.id}`
      )
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, updatedOrder });
});
