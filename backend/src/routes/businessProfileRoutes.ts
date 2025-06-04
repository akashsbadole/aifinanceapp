import { Router } from 'express';
import { businessProfileController } from '../controllers/businessProfileController';

const router = Router();

// Get all business profiles
router.get('/', businessProfileController.getAllProfiles);

// Get default business profile
router.get('/default', businessProfileController.getDefaultProfile);

// Get single business profile by ID
router.get('/:id', businessProfileController.getProfileById);

// Create new business profile
router.post('/', businessProfileController.createProfile);

// Update business profile
router.put('/:id', businessProfileController.updateProfile);

// Set profile as default
router.patch('/:id/default', businessProfileController.setAsDefault);

// Delete business profile
router.delete('/:id', businessProfileController.deleteProfile);

export default router;
