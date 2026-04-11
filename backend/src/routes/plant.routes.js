import { Router } from 'express';
import { upload } from '../config/multer.js';
import {
  createPlantHandler,
  deletePlantHandler,
  getPlantById,
  getPlants,
  updatePlantHandler
} from '../controllers/plant.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getPlants);
router.get('/:plantId', getPlantById);
router.post('/', authenticate, authorize('ADMIN'), upload.single('image'), createPlantHandler);
router.put('/:plantId', authenticate, authorize('ADMIN'), upload.single('image'), updatePlantHandler);
router.delete('/:plantId', authenticate, authorize('ADMIN'), deletePlantHandler);

export default router;
