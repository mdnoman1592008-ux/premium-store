import { Request, Response } from 'express';
import Order from '../models/Order';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      appName,
      planName,
      duration,
      price,
      paymentMethod,
      transactionId,
      senderNumber,
    } = req.body;

    const screenshotUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const order = new Order({
      orderId,
      userId: (req as any).user ? (req as any).user._id : null,
      appName,
      planName,
      duration,
      price,
      paymentMethod,
      transactionId,
      senderNumber,
      screenshotUrl,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userId: (req as any).user._id });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (order) {
      order.status = req.body.status;
      if (req.body.credentialsEmail !== undefined) order.credentialsEmail = req.body.credentialsEmail;
      if (req.body.credentialsPassword !== undefined) order.credentialsPassword = req.body.credentialsPassword;
      if (req.body.credentialsPin !== undefined) order.credentialsPin = req.body.credentialsPin;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const verifiedOrders = await Order.countDocuments({ status: 'Verified' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

    const deliveredOrds = await Order.find({ status: 'Delivered' });
    const revenue = deliveredOrds.reduce((acc, order) => acc + order.price, 0);

    res.json({
      totalOrders,
      pendingOrders,
      verifiedOrders,
      deliveredOrders,
      revenue
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
