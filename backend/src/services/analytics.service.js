import Visit from '../models/Visit.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

export const recordVisit = async ({ page, projectId, ip, userAgent }) =>
  Visit.create({
    page: page || '/',
    project: projectId || null,
    ip: ip || '',
    userAgent: userAgent || '',
  });

export const getAnalyticsSummary = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalVisits,
    recentVisits,
    weeklyVisits,
    topProjects,
    userCount,
    messageCount,
    unreadMessages,
    visitsByDay,
  ] = await Promise.all([
    Visit.countDocuments(),
    Visit.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Visit.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Project.find().sort({ clicks: -1 }).limit(5).select('title slug clicks'),
    User.countDocuments(),
    Message.countDocuments(),
    Message.countDocuments({ isRead: false }),
    Visit.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return {
    totalVisits,
    recentVisits,
    weeklyVisits,
    topProjects,
    userCount,
    messageCount,
    unreadMessages,
    visitsByDay,
  };
};
