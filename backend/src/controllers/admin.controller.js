import asyncHandler from '../utils/asyncHandler.js';
import { getAnalytics } from '../models/order.model.js';
import { listUsers } from '../models/user.model.js';

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const analytics = await getAnalytics(req.db);

  res.json({
    success: true,
    data: analytics
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await listUsers(req.db, req.query);

  res.json({
    success: true,
    data: users
  });
});
