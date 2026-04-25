import crypto from 'crypto';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

/** Hash a refresh token before persisting — limits damage if DB leaks. */
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

/** Issue an access + refresh token pair and persist the HASHED refresh token. */
const issueTokens = async (user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = hashToken(refreshToken);
  await user.save();
  return { accessToken, refreshToken };
};

export const registerUser = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw ApiError.conflict('Email already registered');

  const user = await User.create({ name, email, password });
  const tokens = await issueTokens(user);
  logger.info(`auth.register success email=${email} userId=${user._id}`);
  return { user: user.toPublic(), ...tokens };
};

export const loginUser = async ({ email, password }, ip = '') => {
  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    logger.warn(`auth.login failed reason=no-user-or-inactive email=${email} ip=${ip}`);
    throw ApiError.unauthorized('Invalid credentials');
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    logger.warn(`auth.login failed reason=bad-password email=${email} ip=${ip}`);
    throw ApiError.unauthorized('Invalid credentials');
  }

  const tokens = await issueTokens(user);
  logger.info(`auth.login success email=${email} userId=${user._id} ip=${ip}`);
  return { user: user.toPublic(), ...tokens };
};

export const refreshTokens = async (refreshToken) => {
  if (!refreshToken) throw ApiError.badRequest('Refresh token required');

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive || user.refreshToken !== hashToken(refreshToken)) {
    // Either the user is gone, deactivated, or the token doesn't match the stored hash
    // (rotation already happened, or it was forged)
    throw ApiError.unauthorized('Invalid refresh token');
  }

  return issueTokens(user);
};

/** Invalidate any active refresh token (used on password change / sign-out). */
export const revokeUserTokens = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: '' });
};
