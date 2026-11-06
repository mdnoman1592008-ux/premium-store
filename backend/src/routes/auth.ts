import express from 'express';
import { registerUser, loginUser, googleAuth, resetPasswordSync } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/reset-password-sync', resetPasswordSync);

export default router;
