import { asyncHandler } from '../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.validated);
  res.json({ user });
});

export const getSavedProjects = asyncHandler(async (req, res) => {
  const projects = await userService.getSavedProjects(req.user._id);
  res.json(projects);
});

export const toggleSaveProject = asyncHandler(async (req, res) => {
  const result = await userService.toggleSaveProject(req.user._id, req.params.projectId);
  res.json(result);
});

export const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers({
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
  });
  res.json(result);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.adminUpdateUser(req.params.id, req.validated);
  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.json({ message: 'User deleted' });
});
