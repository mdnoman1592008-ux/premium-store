"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const durationSchema = new mongoose_1.default.Schema({
    months: { type: Number, required: true },
    label: { type: String, required: true },
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    saved: { type: Number, default: 0 },
    tag: { type: String, default: '' },
});
const planSchema = new mongoose_1.default.Schema({
    planName: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    durations: {
        type: [durationSchema],
        default: [
            { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
            { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
            { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
            { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
        ]
    }
});
const productSchema = new mongoose_1.default.Schema({
    appId: { type: String, required: true, unique: true },
    appName: { type: String, required: true },
    category: { type: String, required: true },
    plans: [planSchema]
}, { timestamps: true });
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
