import express from 'express';
import { getProducts, getProductById, updatePlanPrice, cleanup18Months } from '../controllers/productController';
import { adminProtect } from '../middleware/auth';

const router = express.Router();

router.get('/cleanup-18-months', cleanup18Months);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id/plans/:planId', adminProtect, updatePlanPrice);

export default router;
