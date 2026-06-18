"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSettingSchema = new mongoose_1.default.Schema({
    method: { type: String, required: true, unique: true }, // 'bkash', 'nagad', 'rocket', 'upay', 'cellfin'
    number: { type: String, required: true },
    qrCodeUrl: { type: String, default: '' },
}, { timestamps: true });
const PaymentSetting = mongoose_1.default.model('PaymentSetting', paymentSettingSchema);
exports.default = PaymentSetting;
