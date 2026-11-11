import { Router } from 'express';
import { createOrder, myOrders, trackOrder } from '../controllers/orderController.js';
import { optionalAuth, protect } from '../middleware/auth.js';

const router = Router();
router.post('/', optionalAuth, createOrder);
router.get('/mine', protect, myOrders);
router.get('/track', trackOrder);
export default router;
