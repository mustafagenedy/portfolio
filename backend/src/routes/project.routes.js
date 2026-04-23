import { Router } from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
} from '../controllers/project.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator.js';

const router = Router();

// Public
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

// Admin
router.post('/', authenticate, authorize('admin'), validate(createProjectSchema), createProject);
router.put('/:id', authenticate, authorize('admin'), validate(updateProjectSchema), updateProject);
router.delete('/:id', authenticate, authorize('admin'), deleteProject);
router.post('/:id/images', authenticate, authorize('admin'), upload.array('images', 10), uploadProjectImages);

export default router;
