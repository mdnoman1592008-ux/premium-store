"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    orderId: { type: String, required: true, unique: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    appName: { type: String, required: true },
    planName: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    senderNumber: { type: String, required: true },
    screenshotUrl: { type: String },
    status: { type: String, enum: ['Pending', 'Verified', 'Delivered', 'Cancelled'], default: 'Pending' },
    credentialsEmail: { type: String },
    credentialsPassword: { type: String },
    credentialsPin: { type: String },
}, { timestamps: true });
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
