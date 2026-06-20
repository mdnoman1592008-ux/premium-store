"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApiKey = exports.addApiKeys = exports.getApiKeys = exports.resetUserPassword = exports.getUsers = exports.loginAdmin = void 0;
const Admin_1 = __importDefault(require("../models/Admin"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin_1.default.findOne({ username });
        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                username: admin.username,
                token: generateToken(admin._id.toString()),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.loginAdmin = loginAdmin;
const getUsers = async (req, res) => {
    try {
        const users = await User_1.default.find({}).select('-password');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUsers = getUsers;
const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters' });
            return;
        }
        const user = await User_1.default.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.resetUserPassword = resetUserPassword;
const ApiKey_1 = __importDefault(require("../models/ApiKey"));
const getApiKeys = async (req, res) => {
    try {
        const keys = await ApiKey_1.default.find({}).sort({ createdAt: -1 });
        res.json(keys);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getApiKeys = getApiKeys;
const addApiKeys = async (req, res) => {
    try {
        const { provider, keys } = req.body; // 'keys' should be a string (multiline or comma-separated)
        if (!provider || !keys) {
            res.status(400).json({ message: 'Provider and keys are required' });
            return;
        }
        const keyArray = keys.split(/[\n,]+/).map((k) => k.trim()).filter((k) => k.length > 0);
        let addedCount = 0;
        for (const key of keyArray) {
            try {
                await ApiKey_1.default.create({ provider, key });
                addedCount++;
            }
            catch (err) {
                // Ignore duplicate key errors
                if (err.code !== 11000) {
                    console.error('Error adding key:', err);
                }
            }
        }
        res.json({ message: `Successfully added ${addedCount} keys for ${provider}` });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addApiKeys = addApiKeys;
const deleteApiKey = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ApiKey_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: 'Key not found' });
            return;
        }
        res.json({ message: 'API Key deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteApiKey = deleteApiKey;
