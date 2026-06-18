"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlanPrice = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const getProducts = async (req, res) => {
    try {
        const products = await Product_1.default.find({});
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.default.findOne({ appId: req.params.id });
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductById = getProductById;
const updatePlanPrice = async (req, res) => {
    try {
        const { id, planId } = req.params;
        const { durations } = req.body;
        const product = await Product_1.default.findOne({ appId: id });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        const plan = product.plans.id(planId);
        if (!plan) {
            res.status(404).json({ message: 'Plan not found' });
            return;
        }
        if (durations && Array.isArray(durations)) {
            // @ts-ignore
            plan.durations = durations;
        }
        await product.save();
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updatePlanPrice = updatePlanPrice;
