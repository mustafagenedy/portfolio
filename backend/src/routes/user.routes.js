import { Router } from 'express';
import {
  getUsers,
  updateUser,
  deleteUser,
  updateProfile,
  getSavedProjects,
  toggleSaveProject,
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema, adminUpdateUserSchema } from '../validators/user.validator.js';

const router = Router();

// User
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.get('/saved', authenticate, getSavedProjects);
router.post('/saved/:projectId', authenticate, toggleSaveProject);

// Admin
router.get('/', authenticate, authorize('admin'), getUsers);
router.put('/:id', authenticate, authorize('admin'), validate(adminUpdateUserSchema), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;
