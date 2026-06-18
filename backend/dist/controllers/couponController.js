"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCoupon = exports.deleteCoupon = exports.updateCoupon = exports.getCoupons = exports.createCoupon = void 0;
const Coupon_1 = __importDefault(require("../models/Coupon"));
const createCoupon = async (req, res) => {
    try {
        const { code, discountPercentage, validUntil } = req.body;
        const coupon = new Coupon_1.default({
            code,
            discountPercentage,
            validUntil
        });
        const createdCoupon = await coupon.save();
        res.status(201).json(createdCoupon);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createCoupon = createCoupon;
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon_1.default.find({});
        res.json(coupons);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCoupons = getCoupons;
const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, discountPercentage, validUntil, isActive } = req.body;
        const coupon = await Coupon_1.default.findById(id);
        if (!coupon) {
            res.status(404).json({ message: 'Coupon not found' });
            return;
        }
        if (code !== undefined)
            coupon.code = code;
        if (discountPercentage !== undefined)
            coupon.discountPercentage = discountPercentage;
        if (validUntil !== undefined)
            coupon.validUntil = validUntil;
        if (isActive !== undefined)
            coupon.isActive = isActive;
        const updatedCoupon = await coupon.save();
        res.json(updatedCoupon);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateCoupon = updateCoupon;
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon_1.default.findById(id);
        if (!coupon) {
            res.status(404).json({ message: 'Coupon not found' });
            return;
        }
        await Coupon_1.default.findByIdAndDelete(id);
        res.json({ message: 'Coupon deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteCoupon = deleteCoupon;
const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon_1.default.findOne({ code: code.toUpperCase() });
        if (!coupon) {
            res.status(404).json({ message: 'Invalid coupon code' });
            return;
        }
        if (!coupon.isActive) {
            res.status(400).json({ message: 'Coupon is no longer active' });
            return;
        }
        if (new Date(coupon.validUntil) < new Date()) {
            res.status(400).json({ message: 'Coupon has expired' });
            return;
        }
        res.json(coupon);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.validateCoupon = validateCoupon;
