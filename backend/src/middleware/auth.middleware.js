import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { findUserById } from '../models/user.model.js';
import { verifyToken } from '../utils/jwt.js';

export const attachDatabase = (db) => (req, _res, next) => {
  req.db = db;
  next();
};

export const authenticate = asyncHandler(async (req, _res, next) => {
  const authorizationHeader = req.headers.authorization || '';
  const token = authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.slice(7)
    : null;

  if (!token) {
    throw new ApiError(401, 'Authentication token is required.');
  }

  const payload = verifyToken(token);
  const user = await findUserById(req.db, Number(payload.sub));

  if (!user) {
    throw new ApiError(401, 'Authentication is no longer valid.');
  }

  req.user = user;
  next();
});

export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ApiError(403, 'You do not have permission to access this resource.'));
      return;
    }

    next();
  };
