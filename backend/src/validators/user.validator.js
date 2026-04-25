import { z } from 'zod';
import { strongPassword } from './auth.validator.js';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  avatar: z.string().url().or(z.literal('')).optional(),
  password: strongPassword.optional(),
});

export const adminUpdateUserSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  isActive: z.boolean().optional(),
});
