import express from 'express';
import { createCoupon, getCoupons, updateCoupon, deleteCoupon, validateCoupon } from '../controllers/couponController';
import { protect, adminProtect } from '../middleware/auth';

const router = express.Router();

router.post('/validate', validateCoupon);

router.post('/', adminProtect, createCoupon);
router.get('/', adminProtect, getCoupons);
router.put('/:id', adminProtect, updateCoupon);
router.delete('/:id', adminProtect, deleteCoupon);

export default router;
