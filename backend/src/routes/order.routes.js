import { Router } from 'express';
import { checkout, getMyOrders, getOrderDetails } from '../controllers/order.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, authorize('USER', 'ADMIN'));
router.get('/', getMyOrders);
router.post('/checkout', checkout);
router.get('/:orderId', getOrderDetails);

export default router;
