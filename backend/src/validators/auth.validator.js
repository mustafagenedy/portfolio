import { z } from 'zod';

/**
 * Strong password requirements:
 * - 8+ characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one digit
 */
const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100)
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one digit');

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().max(254),
  password: strongPassword,
});

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(100),
});

export { strongPassword };
