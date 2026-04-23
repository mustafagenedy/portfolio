import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  sendMessage,
  getMessages,
  getMyMessages,
  deleteMessage,
  markRead,
} from '../controllers/message.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { sendMessageSchema } from '../validators/message.validator.js';

const router = Router();

const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many messages, try again later' },
});

// Authenticated users
router.post('/', authenticate, messageLimiter, validate(sendMessageSchema), sendMessage);
router.get('/mine', authenticate, getMyMessages);

// Admin
router.get('/', authenticate, authorize('admin'), getMessages);
router.put('/:id/read', authenticate, authorize('admin'), markRead);
router.delete('/:id', authenticate, authorize('admin'), deleteMessage);

export default router;
