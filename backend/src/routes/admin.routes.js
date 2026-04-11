import { Router } from 'express';
import { getDashboardAnalytics, getUsers } from '../controllers/admin.controller.js';
import { getAdminOrders, updateOrderStatusHandler } from '../controllers/order.controller.js';
import { getAdminPlants } from '../controllers/plant.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));
router.get('/analytics', getDashboardAnalytics);
router.get('/users', getUsers);
router.get('/orders', getAdminOrders);
router.patch('/orders/:orderId/status', updateOrderStatusHandler);
router.get('/plants', getAdminPlants);

export default router;
