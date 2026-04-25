import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.validated);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.validated, req.ip);
  res.json(result);
});

export const refresh = asyncHandler(async (req, res) => {
  const tokens = await authService.refreshTokens(req.body.refreshToken);
  res.json(tokens);
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublic() });
});
