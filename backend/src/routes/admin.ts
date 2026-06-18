import express from 'express';
import { loginAdmin, getUsers, resetUserPassword } from '../controllers/adminController';
import { getAllOrders, updateOrderStatus, getAdminStats } from '../controllers/orderController';
import { adminProtect } from '../middleware/auth';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/orders', adminProtect, getAllOrders);
router.put('/orders/:id/status', adminProtect, updateOrderStatus);
router.get('/stats', adminProtect, getAdminStats);
router.get('/users', adminProtect, getUsers);
router.put('/users/:id/reset-password', adminProtect, resetUserPassword);

export default router;
