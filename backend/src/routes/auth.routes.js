import { Router } from 'express';
import {
  getCurrentUser,
  login,
  requestRegistrationOtp,
  verifyRegistrationOtp
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register/request-otp', requestRegistrationOtp);
router.post('/register/verify-otp', verifyRegistrationOtp);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);

export default router;
