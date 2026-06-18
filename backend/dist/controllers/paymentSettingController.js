"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentSetting = exports.getPaymentSettings = void 0;
const PaymentSetting_1 = __importDefault(require("../models/PaymentSetting"));
const getPaymentSettings = async (req, res) => {
    try {
        const settings = await PaymentSetting_1.default.find({});
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPaymentSettings = getPaymentSettings;
const updatePaymentSetting = async (req, res) => {
    try {
        const { method } = req.params;
        const { number } = req.body;
        // Normalize method name to lowercase
        const normalizedMethod = method.toLowerCase();
        let setting = await PaymentSetting_1.default.findOne({ method: normalizedMethod });
        if (!setting) {
            setting = new PaymentSetting_1.default({ method: normalizedMethod, number });
        }
        else {
            if (number)
                setting.number = number;
        }
        if (req.file) {
            const b64 = req.file.buffer.toString('base64');
            const mimeType = req.file.mimetype;
            setting.qrCodeUrl = `data:${mimeType};base64,${b64}`;
        }
        const updatedSetting = await setting.save();
        res.json(updatedSetting);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updatePaymentSetting = updatePaymentSetting;
