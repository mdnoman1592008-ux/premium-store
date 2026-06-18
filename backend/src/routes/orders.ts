import express from 'express';
import { createOrder, getOrderById, getMyOrders } from '../controllers/orderController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

router.post('/', protect, upload.single('screenshot'), createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', getOrderById);

export default router;
