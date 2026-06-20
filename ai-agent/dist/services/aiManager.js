"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processWithAIFallback = void 0;
const openrouter_1 = require("./openrouter");
const deepseek_1 = require("./deepseek");
const groq_1 = require("./groq");
const gemini_1 = require("./gemini");
const ApiKey_1 = __importDefault(require("../models/ApiKey"));
const CASCADE_ORDER = [
    { provider: 'openrouter', service: openrouter_1.chatWithAgent },
    { provider: 'deepseek', service: deepseek_1.chatWithAgent },
    { provider: 'groq', service: groq_1.chatWithAgent },
    { provider: 'gemini', service: gemini_1.chatWithAgent }
];
const ai_brain_1 = require("../ai_brain");
const processWithAIFallback = async (sessionId, userMessage) => {
    for (const step of CASCADE_ORDER) {
        // 1. Fetch active keys for this provider from DB
        const apiKeys = await ApiKey_1.default.find({ provider: step.provider, isActive: true });
        if (apiKeys.length === 0) {
            console.warn(`[AI Fallback] Skipping ${step.provider} (No active keys found in DB).`);
            continue; // Move to the next provider
        }
        // 2. Intra-provider rotation
        for (const keyDoc of apiKeys) {
            try {
                console.log(`[AI Fallback] Attempting ${step.provider} with key ending in ...${keyDoc.key.slice(-4)}`);
                return await step.service(sessionId, userMessage, keyDoc.key);
            }
            catch (err) {
                console.error(`[AI Fallback] ${step.provider} Key failed: ${err.message}. Rotating...`);
                // Log the error in DB to help admin
                keyDoc.lastError = err.message || 'Unknown Error';
                await keyDoc.save();
            }
        }
    }
    // If all providers and all keys fail, use the Local AI Brain as the ultimate fallback
    console.error(`[AI Fallback] ALL EXTERNAL AI SERVICES FAILED. Falling back to Local AI Brain.`);
    const localReply = (0, ai_brain_1.processLocalBrain)(userMessage);
    if (localReply) {
        return localReply;
    }
    // If even local brain doesn't have an answer
    return "আমি অত্যন্ত দুঃখিত, বর্তমানে সার্ভারে একটি টেকনিক্যাল সমস্যার কারণে রিপ্লাই দিতে পারছি না। আমাদের অ্যাডমিন খুব দ্রুত এটি ঠিক করে দিবেন। দয়া করে কিছুক্ষণ পর আবার মেসেজ দিন।";
};
exports.processWithAIFallback = processWithAIFallback;
