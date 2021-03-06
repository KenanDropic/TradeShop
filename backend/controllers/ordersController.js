import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";
import { NotFoundError, UnAuthorizedError } from "../utils/errorResponse.js";

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
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new NotFoundError("Order not found"));
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
        email_address: req.body.payer.email_address,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, updatedOrder });
});

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/delivered
// @access  Private
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new NotFoundError("Order not found"));
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isDelivered: true,
      deliveredAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, updatedOrder });
});

// @desc    Get all user's order OR Get all orders in general
// @route   GET /api/v1/auth/:userId/orders
// @route   GET /api/v1/orders
// @access  Public/Private-Admin
export const getOrders = asyncHandler(async (req, res, next) => {
  let orders;
  if (req.params.userId) {
    orders = await Order.find({ user: req.params.userId });
  } else {
    if (req.user.role === "admin") {
      orders = await Order.find({}).populate({
        path: "user",
        select: "name id",
      });
    } else {
      return next(
        new UnAuthorizedError("User is not authorized to access this route")
      );
    }
  }

  if (!orders) {
    return next(new NotFoundError("Orders not found"));
  }

  res.status(200).json({ success: true, count: orders.length, orders });
});
