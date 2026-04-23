import { z } from 'zod';

export const sendMessageSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  subject: z.string().max(100).optional().default('No subject'),
  body: z.string().min(5).max(2000),
});
