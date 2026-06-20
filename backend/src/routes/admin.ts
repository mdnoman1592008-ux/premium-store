import express from 'express';
import { loginAdmin, getUsers, resetUserPassword, getApiKeys, addApiKeys, deleteApiKey } from '../controllers/adminController';
import { getAllOrders, updateOrderStatus, getAdminStats } from '../controllers/orderController';
import { adminProtect } from '../middleware/auth';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/orders', adminProtect, getAllOrders);
router.put('/orders/:id/status', adminProtect, updateOrderStatus);
router.get('/stats', adminProtect, getAdminStats);
router.get('/users', adminProtect, getUsers);
router.put('/users/:id/reset-password', adminProtect, resetUserPassword);

// AI Key Management
router.get('/ai-keys', adminProtect, getApiKeys);
router.post('/ai-keys', adminProtect, addApiKeys);
router.delete('/ai-keys/:id', adminProtect, deleteApiKey);

export default router;
