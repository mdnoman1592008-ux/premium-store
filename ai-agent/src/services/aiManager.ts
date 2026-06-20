import { chatWithAgent as openRouterChat } from './openrouter';
import { chatWithAgent as deepseekChat } from './deepseek';
import { chatWithAgent as groqChat } from './groq';
import { chatWithAgent as geminiChat } from './gemini';
import ApiKey from '../models/ApiKey';

const CASCADE_ORDER = [
  { provider: 'openrouter', service: openRouterChat },
  { provider: 'deepseek', service: deepseekChat },
  { provider: 'groq', service: groqChat },
  { provider: 'gemini', service: geminiChat }
];

export const processWithAIFallback = async (sessionId: string, userMessage: string): Promise<string> => {
  for (const step of CASCADE_ORDER) {
    // 1. Fetch active keys for this provider from DB
    const apiKeys = await ApiKey.find({ provider: step.provider, isActive: true });
    
    if (apiKeys.length === 0) {
      console.warn(`[AI Fallback] Skipping ${step.provider} (No active keys found in DB).`);
      continue; // Move to the next provider
    }

    // 2. Intra-provider rotation
    for (const keyDoc of apiKeys) {
      try {
        console.log(`[AI Fallback] Attempting ${step.provider} with key ending in ...${keyDoc.key.slice(-4)}`);
        return await step.service(sessionId, userMessage, keyDoc.key);
      } catch (err: any) {
        console.error(`[AI Fallback] ${step.provider} Key failed: ${err.message}. Rotating...`);
        // Log the error in DB to help admin
        keyDoc.lastError = err.message || 'Unknown Error';
        await keyDoc.save();
      }
    }
  }

  // If all providers and all keys fail
  console.error(`[AI Fallback] ALL AI SERVICES FAILED.`);
  return "আমি অত্যন্ত দুঃখিত, বর্তমানে সার্ভারে একটি টেকনিক্যাল সমস্যার কারণে রিপ্লাই দিতে পারছি না। আমাদের অ্যাডমিন খুব দ্রুত এটি ঠিক করে দিবেন। দয়া করে কিছুক্ষণ পর আবার মেসেজ দিন।";
};
