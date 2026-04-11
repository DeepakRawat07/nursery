import { Router } from 'express';
import authRoutes from './auth.routes.js';
import plantRoutes from './plant.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './order.routes.js';
import wishlistRoutes from './wishlist.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/plants', plantRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);

export default router;
