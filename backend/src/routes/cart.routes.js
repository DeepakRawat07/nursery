import { Router } from 'express';
import { addCartItem, deleteCartItem, getCart, updateCartItem } from '../controllers/cart.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, authorize('USER', 'ADMIN'));
router.get('/', getCart);
router.post('/items', addCartItem);
router.patch('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', deleteCartItem);

export default router;
