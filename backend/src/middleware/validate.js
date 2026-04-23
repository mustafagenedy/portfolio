import ApiError from '../utils/ApiError.js';

/** Zod validation middleware factory. */
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors));
  }
  req.validated = result.data;
  next();
};
