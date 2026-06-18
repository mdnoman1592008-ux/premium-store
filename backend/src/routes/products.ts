import express from 'express';
import { getProducts, getProductById, updatePlanPrice } from '../controllers/productController';
import { adminProtect } from '../middleware/auth';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id/plans/:planId', adminProtect, updatePlanPrice);

export default router;
