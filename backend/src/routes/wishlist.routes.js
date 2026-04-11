import { Router } from 'express';
import { addWishlistPlant, deleteWishlistPlant, getWishlist } from '../controllers/wishlist.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, authorize('USER', 'ADMIN'));
router.get('/', getWishlist);
router.post('/items', addWishlistPlant);
router.delete('/items/:plantId', deleteWishlistPlant);

export default router;
