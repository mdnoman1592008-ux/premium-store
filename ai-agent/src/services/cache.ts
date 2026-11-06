import Product from '../models/Product';
import ApiKey from '../models/ApiKey';
import ChatHistory from '../models/ChatHistory';
import { processLocalBrain } from '../ai_brain';

// In-memory cache for Products and API Keys (TTL: 60 seconds)
let cachedProducts: any[] | null = null;
let productsCacheTime = 0;

let cachedApiKeys: any[] | null = null;
let apiKeysCacheTime = 0;

const CACHE_TTL_MS = 60 * 1000;

export const getCachedProducts = async (): Promise<any[]> => {
  const now = Date.now();
  if (cachedProducts && now - productsCacheTime < CACHE_TTL_MS) {
    return cachedProducts;
  }
  try {
    cachedProducts = await Product.find({}).lean();
    productsCacheTime = now;
    return cachedProducts;
  } catch (err) {
    console.error('[Cache] Failed to fetch products:', err);
    return cachedProducts || [];
  }
};

export const getCachedApiKeys = async (provider: string): Promise<any[]> => {
  const now = Date.now();
  if (!cachedApiKeys || now - apiKeysCacheTime >= CACHE_TTL_MS) {
    try {
      cachedApiKeys = await ApiKey.find({ isActive: true }).lean();
      apiKeysCacheTime = now;
    } catch (err) {
      console.error('[Cache] Failed to fetch API keys:', err);
      cachedApiKeys = cachedApiKeys || [];
    }
  }
  return (cachedApiKeys || []).filter((k: any) => k.provider === provider);
};

export const invalidateApiKeysCache = () => {
  cachedApiKeys = null;
  apiKeysCacheTime = 0;
};

export const getCachedCatalogSummaryText = async (): Promise<string> => {
  const products = await getCachedProducts();
  if (!products || products.length === 0) return '';

  const lines = products.map((p: any) => {
    const plansText = (p.plans || [])
      .map((plan: any) => {
        const durs = (plan.durations || [])
          .map((d: any) => `${d.label}: ৳${d.price}`)
          .join(', ');
        return `${plan.planName} [${durs}]`;
      })
      .join(' | ');
    return `- ${p.appName} (appId: ${p.appId}): ${plansText}`;
  });

  return `\n\n### LIVE STORE CATALOG & EXACT BDT PRICES (Already loaded - DO NOT call getStoreCatalog unless needed):\n${lines.join('\n')}`;
};

// Save message pair asynchronously without blocking the HTTP response
export const saveChatHistoryAsync = (sessionId: string, userMessage: string, replyText: string) => {
  setImmediate(async () => {
    try {
      let historyDoc = await ChatHistory.findOne({ sessionId });
      if (!historyDoc) {
        historyDoc = new ChatHistory({ sessionId, messages: [] });
      }
      historyDoc.messages.push({ role: 'user', parts: [{ text: userMessage }] } as any);
      historyDoc.messages.push({ role: 'model', parts: [{ text: replyText }] } as any);
      if (historyDoc.messages.length > 20) {
        historyDoc.messages = historyDoc.messages.slice(-20) as any;
      }
      await historyDoc.save();
    } catch (err) {
      console.error('[Cache] Non-blocking history save error:', err);
    }
  });
};

// Format a single product's plans & prices in Bengali
const formatSingleProductReply = (product: any): string => {
  const planBlocks = (product.plans || []).map((plan: any) => {
    const durLines = (plan.durations || [])
      .map((d: any) => `   • ${d.label}: **৳${d.price}**${d.tag ? ` (${d.tag})` : ''}`)
      .join('\n');
    return `🔹 **${plan.planName}**\n${durLines}`;
  });

  return `হ্যাঁ, আমাদের কাছে **${product.appName}** এভেইলেবল আছে! 🎉\n\nনিচে আমাদের অফিশিয়াল প্ল্যান ও প্রাইস লিস্ট দেওয়া হলো:\n\n${planBlocks.join('\n\n')}\n\n✅ ১০০% ফুল-টার্ম রিপ্লেসমেন্ট ওয়ারেন্টি\n⚡ পেমেন্টের ৫–১০ মিনিটে ইনস্ট্যান্ট ডেলিভারি\n\nআপনি কোন প্ল্যানটি কতদিনের জন্য নিতে চাচ্ছেন? 😊`;
};

// Format the entire store catalog in Bengali
const formatFullCatalogReply = (products: any[]): string => {
  if (!products || products.length === 0) {
    return 'দুঃখিত, বর্তমানে ক্যাটালগ লোড করা যাচ্ছে না। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।';
  }

  const lines = products.map((p: any) => {
    const planSummaries = (p.plans || []).map((plan: any) => {
      const durs = (plan.durations || [])
        .map((d: any) => `${d.label}: ৳${d.price}`)
        .join(' | ');
      return `  • **${plan.planName}**: ${durs}`;
    });
    return `🌟 **${p.appName}**\n${planSummaries.join('\n')}`;
  });

  return `🏷️ **আমাদের সকল প্রিমিয়াম সাবস্ক্রিপশনের আপডেট প্রাইস লিস্ট:**\n\n${lines.join('\n\n')}\n\n✅ সব প্যাকেজেই পাচ্ছেন ১০০% ফুল মেয়াদের গ্যারান্টি!\nআপনি কোন অ্যাপটি নিতে চাচ্ছেন তার নাম বলুন। 😊`;
};

// Ultra-fast instant responder (< 15ms) for quick actions, catalog prices, single-app prices, and common FAQs
export const getInstantFastReply = async (userMessage: string): Promise<string | null> => {
  const clean = userMessage.toLowerCase().trim();

  // 1. Quick Action Pills & Direct Catalog Requests
  if (
    clean === 'show catalog prices' ||
    clean === 'product prices' ||
    clean === 'all prices' ||
    clean === 'price list' ||
    clean === 'sob price' ||
    clean === 'dam koto sob'
  ) {
    const products = await getCachedProducts();
    return formatFullCatalogReply(products);
  }

  if (
    clean === 'how do i track my order?' ||
    clean === 'track order' ||
    clean === 'order track' ||
    clean === 'আমার অর্ডার ট্র্যাক করব কীভাবে?'
  ) {
    return `📦 **অর্ডার ট্র্যাক করার নিয়ম:**\n\n১. ওয়েবসাইটের উপরের মেনু থেকে **My Orders** অপশনে গিয়ে আপনার সব অর্ডারের লাইভ স্ট্যাটাস ও ডেলিভারি ক্রেডেনশিয়াল দেখতে পারবেন।\n২. অথবা আপনার **Order ID** (যেমন: \`ORD-123456\`) এখানে চ্যাটে লিখে পাঠান, আমি এখনই স্ট্যাটাস চেক করে জানাচ্ছি! 😊`;
  }

  if (
    clean === 'i want to reset my password' ||
    clean === 'reset password' ||
    clean === 'forgot password'
  ) {
    return `🔑 **পাসওয়ার্ড রিসেট করার নিয়ম:**\n\n১. আমাদের ওয়েবসাইটের **Login** পেইজে গিয়ে **"Forgot Password?"** অপশনে ক্লিক করে আপনার ইমেইল দিলেই সাথে সাথে পাসওয়ার্ড রিসেট লিংক পেয়ে যাবেন।\n২. অথবা আপনি চাইলে আপনার একাউন্টের **ইমেইল বা ফোন নাম্বারটি** এখানে চ্যাটে দিন, আমি আপনাকে একটি টেম্পোরারি পাসওয়ার্ড তৈরি করে দিচ্ছি! 😊`;
  }

  // 2. If user is passing an Order ID (ORD-...) or phone number (01...) or TrxID, let the LLM + tools handle it!
  if (/ord-\d+/i.test(clean) || /\b01[3-9]\d{8}\b/.test(clean) || /trx/i.test(clean) || /@/.test(clean)) {
    return null;
  }

  // 3. Check if user is asking about a specific product in our catalog (e.g., "chatgpt price", "gemini dam koto", "youtube", "spotify")
  const products = await getCachedProducts();
  const productAliases: Record<string, string[]> = {
    chatgpt: ['chatgpt', 'chat gpt', 'gpt', 'openai'],
    gemini: ['gemini', 'google ai', 'bard'],
    youtube: ['youtube', 'yt', 'ইউটিউব'],
    spotify: ['spotify', 'স্পটিফাই'],
    capcut: ['capcut', 'cap cut', 'ক্যাপকাট'],
    inshot: ['inshot', 'in shot'],
    claude: ['claude', 'anthropic'],
    grok: ['grok', 'supergrok'],
    veo: ['veo', 'veo 3', 'veo3']
  };

  const matchedApps: any[] = [];
  for (const prod of products) {
    const appId = (prod.appId || '').toLowerCase();
    const appName = (prod.appName || '').toLowerCase();
    const aliases = productAliases[appId] || [appId, appName];
    if (aliases.some(alias => alias && clean.includes(alias))) {
      matchedApps.push(prod);
    }
  }

  // If user mentioned exactly 1 product and is asking a short question (<= 8 words), give instant accurate price table!
  const wordCount = clean.split(/\s+/).length;
  if (matchedApps.length === 1 && wordCount <= 8) {
    return formatSingleProductReply(matchedApps[0]);
  }

  // 4. Check Local Brain for fast static intents (Greetings, Payment Number, Warranty, Support, Thanks, etc.)
  if (wordCount <= 7) {
    const localReply = processLocalBrain(userMessage);
    if (localReply) {
      return localReply;
    }
  }

  return null;
};
