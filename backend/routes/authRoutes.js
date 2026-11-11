import { Router } from 'express';
import { forgotPassword, login, me, register, updateMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, me);
router.put('/me', protect, updateMe);
export default router;
