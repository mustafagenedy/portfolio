import { Router } from 'express';
import { trackVisit, getAnalytics } from '../controllers/analytics.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/track', trackVisit);
router.get('/', authenticate, authorize('admin'), getAnalytics);

export default router;
