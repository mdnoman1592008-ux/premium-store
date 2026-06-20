import { chatWithAgent as openRouterChat } from './openrouter';
import { chatWithAgent as groqChat } from './groq';
import { chatWithAgent as geminiChat } from './gemini';

/**
 * AI Manager
 * This orchestrates the fallback cascade: OpenRouter -> Groq -> Gemini
 */
export const processWithAIFallback = async (sessionId: string, userMessage: string): Promise<string> => {
  try {
    console.log(`[AI Fallback] Attempting OpenRouter for session ${sessionId}...`);
    return await openRouterChat(sessionId, userMessage);
  } catch (errOpenRouter: any) {
    console.error(`[AI Fallback] OpenRouter failed: ${errOpenRouter.message}. Falling back to Groq...`);
    
    try {
      console.log(`[AI Fallback] Attempting Groq for session ${sessionId}...`);
      return await groqChat(sessionId, userMessage);
    } catch (errGroq: any) {
      console.error(`[AI Fallback] Groq failed: ${errGroq.message}. Falling back to Gemini...`);
      
      try {
        console.log(`[AI Fallback] Attempting Gemini for session ${sessionId}...`);
        return await geminiChat(sessionId, userMessage);
      } catch (errGemini: any) {
        console.error(`[AI Fallback] Gemini failed: ${errGemini.message}. All AI services exhausted.`);
        return "আমি অত্যন্ত দুঃখিত, বর্তমানে সার্ভারে একটি টেকনিক্যাল সমস্যার কারণে রিপ্লাই দিতে পারছি না। আমাদের অ্যাডমিন খুব দ্রুত এটি ঠিক করে দিবেন। দয়া করে কিছুক্ষণ পর আবার মেসেজ দিন। (Error: All API services failed)";
      }
    }
  }
};
