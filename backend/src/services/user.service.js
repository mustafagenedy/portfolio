import User from '../models/User.js';
import SavedProject from '../models/SavedProject.js';
import ApiError from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { revokeUserTokens } from './auth.service.js';

export const updateProfile = async (userId, { name, avatar, password }) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  if (password) {
    user.password = password;
    // Invalidate any refresh token issued before the password change.
    user.refreshToken = '';
    logger.info(`auth.password-change userId=${userId}`);
  }
  await user.save();
  return user.toPublic();
};

export const getSavedProjects = async (userId) => {
  const saved = await SavedProject.find({ user: userId }).populate('project');
  return saved.map((s) => s.project).filter(Boolean);
};

export const toggleSaveProject = async (userId, projectId) => {
  const existing = await SavedProject.findOne({ user: userId, project: projectId });
  if (existing) {
    await existing.deleteOne();
    return { saved: false };
  }
  await SavedProject.create({ user: userId, project: projectId });
  return { saved: true };
};

// Admin
export const listUsers = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().select('-password -refreshToken').skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);
  return { users, total, page, pages: Math.ceil(total / limit) };
};

export const adminUpdateUser = async (id, { role, isActive }, actingUserId) => {
  // Self-lockout protection: an admin may not demote/deactivate themselves.
  if (String(id) === String(actingUserId)) {
    if (role && role !== 'admin') {
      throw ApiError.badRequest('You cannot demote yourself');
    }
    if (isActive === false) {
      throw ApiError.badRequest('You cannot deactivate yourself');
    }
  }

  const update = {};
  if (role) update.role = role;
  if (typeof isActive === 'boolean') update.isActive = isActive;

  // If we deactivate or change role, also revoke their session
  if (role || isActive === false) update.refreshToken = '';

  const user = await User.findByIdAndUpdate(id, update, { new: true }).select(
    '-password -refreshToken'
  );
  if (!user) throw ApiError.notFound('User not found');

  logger.info(
    `admin.user-update actingId=${actingUserId} targetId=${id} ` +
      `role=${role || 'unchanged'} isActive=${
        typeof isActive === 'boolean' ? isActive : 'unchanged'
      }`
  );
  return user;
};

export const deleteUser = async (id, actingUserId) => {
  if (String(id) === String(actingUserId)) {
    throw ApiError.badRequest('You cannot delete your own account');
  }

  // If this is the last admin in the system, refuse — keeps the site manageable.
  const target = await User.findById(id);
  if (!target) throw ApiError.notFound('User not found');
  if (target.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) throw ApiError.badRequest('Cannot delete the last admin');
  }

  await target.deleteOne();
  await SavedProject.deleteMany({ user: id });
  await revokeUserTokens(id); // best-effort no-op since user is deleted
  logger.warn(`admin.user-delete actingId=${actingUserId} targetId=${id}`);
  return target;
};
