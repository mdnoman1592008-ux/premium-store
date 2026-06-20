"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const apiKeySchema = new mongoose_1.default.Schema({
    provider: {
        type: String,
        required: true,
        enum: ['openrouter', 'deepseek', 'groq', 'gemini']
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastError: {
        type: String,
        default: ''
    }
}, { timestamps: true });
// Check if model already exists to avoid OverwriteModelError in Next.js/HMR environments
const ApiKey = mongoose_1.default.models.ApiKey || mongoose_1.default.model('ApiKey', apiKeySchema);
exports.default = ApiKey;
