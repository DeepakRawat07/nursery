import multer from 'multer';
import ApiError from '../utils/ApiError.js';

export const notFound = (_req, _res, next) => {
  next(new ApiError(404, 'Route not found.'));
};

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({
      success: false,
      message: error.message
    });
    return;
  }

  if (error.code === '23505') {
    res.status(409).json({
      success: false,
      message: 'A record with the same unique value already exists.'
    });
    return;
  }

  if (error.code === '22P02') {
    res.status(400).json({
      success: false,
      message: 'A request parameter has an invalid format.'
    });
    return;
  }

  if (error instanceof Error && error.message === 'Only image uploads are allowed.') {
    res.status(400).json({
      success: false,
      message: error.message
    });
    return;
  }

  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof ApiError ? error.message : 'Internal server error.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(error.details ? { details: error.details } : {})
  });
};
