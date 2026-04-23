import { asyncHandler } from '../utils/asyncHandler.js';
import * as projectService from '../services/project.service.js';
import ApiError from '../utils/ApiError.js';

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.listProjects({
    category: req.query.category,
    featured: req.query.featured,
  });
  res.json(projects);
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectBySlug(req.params.slug);
  res.json(project);
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.validated);
  res.status(201).json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.validated);
  res.json(project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.id);
  res.json({ message: 'Project deleted' });
});

export const uploadProjectImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw ApiError.badRequest('No images provided');
  const project = await projectService.addProjectImages(req.params.id, req.files);
  res.json(project);
});
