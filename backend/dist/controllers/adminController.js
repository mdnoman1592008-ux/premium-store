"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserPassword = exports.getUsers = exports.loginAdmin = void 0;
const Admin_1 = __importDefault(require("../models/Admin"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
        user.password = newPassword; // Will be hashed by pre-save hook in User model
        await user.save();
        res.json({ message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.resetUserPassword = resetUserPassword;
