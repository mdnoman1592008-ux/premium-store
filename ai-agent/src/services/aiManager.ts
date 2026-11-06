import { chatWithAgent as openRouterChat } from './openrouter';
import { chatWithAgent as deepseekChat } from './deepseek';
import { chatWithAgent as groqChat } from './groq';
import { chatWithAgent as geminiChat } from './gemini';
import ApiKey from '../models/ApiKey';
import { processLocalBrain } from '../ai_brain';
import {
  getCachedApiKeys,
  invalidateApiKeysCache,
  getInstantFastReply,
  saveChatHistoryAsync
} from './cache';

const CASCADE_ORDER = [
  { provider: 'groq', service: groqChat },
  { provider: 'gemini', service: geminiChat },
  { provider: 'openrouter', service: openRouterChat },
  { provider: 'deepseek', service: deepseekChat }
];

let lastWorkingProvider: string | null = null;

export const processWithAIFallback = async (sessionId: string, userMessage: string): Promise<string> => {
  // 0. Ultra-Fast Instant Reply Path (< 15ms) for Quick Actions, Catalog, Single Product Prices, and Common Intents
  try {
    const instantReply = await getInstantFastReply(userMessage);
    if (instantReply) {
      saveChatHistoryAsync(sessionId, userMessage, instantReply);
      return instantReply;
    }
  } catch (err) {
    console.warn('[AI FastPath] Error in instant reply check:', err);
  }

  // Order providers so the last known working provider is tried first
  const orderedSteps = lastWorkingProvider
    ? [
        ...CASCADE_ORDER.filter(s => s.provider === lastWorkingProvider),
        ...CASCADE_ORDER.filter(s => s.provider !== lastWorkingProvider)
      ]
    : CASCADE_ORDER;

  for (const step of orderedSteps) {
    const apiKeys = await getCachedApiKeys(step.provider);
    if (apiKeys.length === 0) {
      continue;
    }

    for (const keyDoc of apiKeys) {
      try {
        const reply = await step.service(sessionId, userMessage, keyDoc.key);
        lastWorkingProvider = step.provider;
        return reply;
      } catch (err: any) {
        console.error(`[AI Fallback] ${step.provider} Key failed: ${err.message}. Rotating...`);
        invalidateApiKeysCache();
        setImmediate(async () => {
          try {
            await ApiKey.findByIdAndUpdate(keyDoc._id, { lastError: err.message || 'Unknown Error' });
          } catch {}
        });
      }
    }
  }

  // Fallback to Local AI Brain if all external services fail
  const localReply = processLocalBrain(userMessage);
  if (localReply) {
    saveChatHistoryAsync(sessionId, userMessage, localReply);
    return localReply;
  }

  return "আমি অত্যন্ত দুঃখিত, বর্তমানে সার্ভারে একটি টেকনিক্যাল সমস্যার কারণে রিপ্লাই দিতে পারছি না। আমাদের অ্যাডমিন খুব দ্রুত এটি ঠিক করে দিবেন। দয়া করে কিছুক্ষণ পর আবার মেসেজ দিন।";
};
