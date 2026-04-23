import User from '../models/User.js';
import SavedProject from '../models/SavedProject.js';
import ApiError from '../utils/ApiError.js';

export const updateProfile = async (userId, { name, avatar, password }) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  if (password) user.password = password;
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

export const adminUpdateUser = async (id, { role, isActive }) => {
  const update = {};
  if (role) update.role = role;
  if (typeof isActive === 'boolean') update.isActive = isActive;

  const user = await User.findByIdAndUpdate(id, update, { new: true }).select(
    '-password -refreshToken'
  );
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw ApiError.notFound('User not found');
  await SavedProject.deleteMany({ user: id });
  return user;
};
