import { asyncHandler } from '../utils/asyncHandler.js';
import * as analyticsService from '../services/analytics.service.js';

export const trackVisit = asyncHandler(async (req, res) => {
  await analyticsService.recordVisit({
    page: req.body.page,
    projectId: req.body.projectId,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  res.json({ tracked: true });
});

export const getAnalytics = asyncHandler(async (_req, res) => {
  const summary = await analyticsService.getAnalyticsSummary();
  res.json(summary);
});
