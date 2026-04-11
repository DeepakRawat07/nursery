import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  createOrderFromCart,
  getOrderById,
  listAllOrders,
  listOrdersByUser,
  updateOrderStatus
} from '../models/order.model.js';
import { validateCheckoutPayload, validateOrderStatusPayload } from '../validators/order.validator.js';

export const checkout = asyncHandler(async (req, res) => {
  const payload = validateCheckoutPayload(req.body);
  const order = await createOrderFromCart(req.user.id, payload);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully.',
    data: order
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await listOrdersByUser(req.db, req.user.id, req.query);

  res.json({
    success: true,
    data: orders
  });
});

export const getOrderDetails = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.orderId);
  const viewerUserId = req.user.role === 'ADMIN' ? null : req.user.id;
  const order = await getOrderById(orderId, viewerUserId);

  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  res.json({
    success: true,
    data: order
  });
});

export const getAdminOrders = asyncHandler(async (req, res) => {
  const filters = {
    ...req.query,
    status: req.query.status ? String(req.query.status).toUpperCase() : undefined
  };
  const orders = await listAllOrders(req.db, filters);

  res.json({
    success: true,
    data: orders
  });
});

export const updateOrderStatusHandler = asyncHandler(async (req, res) => {
  const payload = validateOrderStatusPayload(req.body);
  const order = await updateOrderStatus(req.db, Number(req.params.orderId), payload.status);

  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  res.json({
    success: true,
    message: 'Order status updated successfully.',
    data: order
  });
});
