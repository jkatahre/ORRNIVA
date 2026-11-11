import { Router } from 'express';
import { contact, subscribe } from '../controllers/miscController.js';

const router = Router();
router.post('/newsletter', subscribe);
router.post('/contact', contact);
export default router;
