import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { initGeminiPlus } from './initGeminiPlus';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to Database
connectDB().then(() => {
  initGeminiPlus();
});

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import adminRoutes from './routes/admin';
import couponRoutes from './routes/coupons';
import paymentSettingRoutes from './routes/paymentSettings';
import uploadRoutes from './routes/uploadRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payment-settings', paymentSettingRoutes);
app.use('/api/upload', uploadRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
