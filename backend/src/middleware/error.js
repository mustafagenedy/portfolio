import ApiError from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

/** 404 for unmatched routes. */
export const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

/** Central error handler — converts Mongoose/JWT errors into ApiError shape. */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let error = err;

  // Mongoose: invalid ObjectId
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }
  // Mongoose: duplicate key
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = ApiError.conflict(`${field} already exists`);
  }
  // Mongoose: validation
  else if (err.name === 'ValidationError') {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([k, v]) => [k, v.message])
    );
    error = ApiError.badRequest('Validation failed', details);
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Invalid or expired token');
  }
  // Non-operational / unknown errors — never leak internals
  else if (!error.isOperational) {
    logger.error(err.stack || err);
    error = new ApiError(500, 'Internal server error');
  }

  const payload = { error: error.message };
  if (error.details) payload.details = error.details;

  res.status(error.status || 500).json(payload);
};
