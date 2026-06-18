"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = exports.updateOrderStatus = exports.getAllOrders = exports.getMyOrders = exports.getOrderById = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const createOrder = async (req, res) => {
    try {
        const { appName, planName, duration, price, paymentMethod, transactionId, senderNumber, } = req.body;
        const screenshotUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const order = new Order_1.default({
            orderId,
            userId: req.user ? req.user._id : null,
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createOrder = createOrder;
const getOrderById = async (req, res) => {
    try {
        const order = await Order_1.default.findOne({ orderId: req.params.id });
        if (order) {
            res.json(order);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getOrderById = getOrderById;
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({ userId: req.user._id });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMyOrders = getMyOrders;
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({}).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order_1.default.findOne({ orderId: req.params.id });
        if (order) {
            order.status = req.body.status;
            if (req.body.credentialsEmail !== undefined)
                order.credentialsEmail = req.body.credentialsEmail;
            if (req.body.credentialsPassword !== undefined)
                order.credentialsPassword = req.body.credentialsPassword;
            if (req.body.credentialsPin !== undefined)
                order.credentialsPin = req.body.credentialsPin;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const getAdminStats = async (req, res) => {
    try {
        const totalOrders = await Order_1.default.countDocuments();
        const pendingOrders = await Order_1.default.countDocuments({ status: 'Pending' });
        const verifiedOrders = await Order_1.default.countDocuments({ status: 'Verified' });
        const deliveredOrders = await Order_1.default.countDocuments({ status: 'Delivered' });
        const deliveredOrds = await Order_1.default.find({ status: 'Delivered' });
        const revenue = deliveredOrds.reduce((acc, order) => acc + order.price, 0);
        res.json({
            totalOrders,
            pendingOrders,
            verifiedOrders,
            deliveredOrders,
            revenue
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAdminStats = getAdminStats;
