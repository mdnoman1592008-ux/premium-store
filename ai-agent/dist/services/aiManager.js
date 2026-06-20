"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processWithAIFallback = void 0;
const openrouter_1 = require("./openrouter");
const groq_1 = require("./groq");
const gemini_1 = require("./gemini");
/**
 * AI Manager
 * This orchestrates the fallback cascade: OpenRouter -> Groq -> Gemini
 */
const processWithAIFallback = async (sessionId, userMessage) => {
    try {
        console.log(`[AI Fallback] Attempting OpenRouter for session ${sessionId}...`);
        return await (0, openrouter_1.chatWithAgent)(sessionId, userMessage);
    }
    catch (errOpenRouter) {
        console.error(`[AI Fallback] OpenRouter failed: ${errOpenRouter.message}. Falling back to Groq...`);
        try {
            console.log(`[AI Fallback] Attempting Groq for session ${sessionId}...`);
            return await (0, groq_1.chatWithAgent)(sessionId, userMessage);
        }
        catch (errGroq) {
            console.error(`[AI Fallback] Groq failed: ${errGroq.message}. Falling back to Gemini...`);
            try {
                console.log(`[AI Fallback] Attempting Gemini for session ${sessionId}...`);
                return await (0, gemini_1.chatWithAgent)(sessionId, userMessage);
            }
            catch (errGemini) {
                console.error(`[AI Fallback] Gemini failed: ${errGemini.message}. All AI services exhausted.`);
                return "আমি অত্যন্ত দুঃখিত, বর্তমানে সার্ভারে একটি টেকনিক্যাল সমস্যার কারণে রিপ্লাই দিতে পারছি না। আমাদের অ্যাডমিন খুব দ্রুত এটি ঠিক করে দিবেন। দয়া করে কিছুক্ষণ পর আবার মেসেজ দিন। (Error: All API services failed)";
            }
        }
    }
};
exports.processWithAIFallback = processWithAIFallback;
