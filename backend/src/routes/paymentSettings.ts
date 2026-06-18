import express from 'express';
import { getPaymentSettings, updatePaymentSetting } from '../controllers/paymentSettingController';
import { adminProtect } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

router.get('/', getPaymentSettings);
router.put('/:method', adminProtect, upload.single('qrCode'), updatePaymentSetting);

export default router;
