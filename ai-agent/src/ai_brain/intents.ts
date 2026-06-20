export const INTENT_PATTERNS = [
  {
    intent: 'GREETING',
    regex: /^(hi|hello|hey|assalamu|salam|hi vai|hello vai|vai|vaiya|hy|hlo|হ্যালো|হাই|আসসালামু|সালাম)\s*$/i
  },
  {
    intent: 'PAYMENT_NUMBER',
    regex: /(number dao|number den|number daben|bkash number|nagad number|rocket number|payment number|number ta den|payment kivabe korbo|send money number|নাম্বার|বিকাশ নাম্বার|নগদ নাম্বার|পেমেন্ট নাম্বার)/i
  },
  {
    intent: 'HOW_TO_ORDER',
    regex: /(kivabe order|kivabe nibo|order process|kivabe kinbo|kivabe payment korbo|order korbo kivabe|how to order|how to buy|কিভাবে কিনবো|কিভাবে অর্ডার করবো)/i
  },
  {
    intent: 'PASSWORD_RESET_INFO',
    regex: /(password vule gechi|password reset|forget password|password mone nai|password haray felse|পাসওয়ার্ড ভুলে গেছি|পাসওয়ার্ড রিসেট)/i
  },
  {
    intent: 'WEBSITE_LINK',
    regex: /(website link|website|site link|link den|link dao|ওয়েবসাইট লিংক|ওয়েবসাইট)/i
  },
  {
    intent: 'SUPPORT_CONTACT',
    regex: /(support number|contact number|admin number|kotha bolbo kivabe|kotha bolte chai|help lagbe|help chai|সাপোর্ট নাম্বার|কথা বলতে চাই)/i
  },
  {
    intent: 'THANKS',
    regex: /^(thanks|dhonnobad|thank you|tk|thx|tq|tnx|ধন্যবাদ|থ্যাংকস)\s*$/i
  },
  {
    intent: 'WARRANTY_INFO',
    regex: /(warranty|guarantee|nischoyota|problem hole ki korben|warranty ase|replace pabo|রিপ্লেস পাবো|ওয়ারেন্টি|গ্যারান্টি)/i
  }
];

export const detectIntent = (text: string): string | null => {
  const cleanText = text.trim().toLowerCase();
  for (const pattern of INTENT_PATTERNS) {
    if (pattern.regex.test(cleanText)) {
      return pattern.intent;
    }
  }
  return null;
};
