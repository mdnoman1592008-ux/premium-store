export const INTENT_PATTERNS = [
  {
    intent: 'GREETING',
    regex: /^(hi|hello|hey|assalamu|salam|hy|hlo|হ্যালো|হাই|আসসালামু|সালাম|helo|holla|hlw|namaskar|nomoskar|adab|yoo|oy|oee|oi)(?:\s+(vai|vaiya|bhai|brother|bro|sir|boss|mama))?\s*$/i
  },
  {
    intent: 'GREETING', // Secondary catch for "How are you"
    regex: /^(ki obstha|kemon achen|kmn asen|kemon asen|kemon acho|kmn aco|valani|bhalo achen|kemne asen|obostha ki|kire vai)\s*$/i
  },
  {
    intent: 'PAYMENT_NUMBER',
    // Matches thousands of payment number requests
    regex: /(number|no|num|namber|numbr|nmber|taka|tk|money|pay|pement|payment|bkash|nagad|rocket|bkas|nagd|rokrt)\s*(dao|den|deben|diben|din|ta den|pathabo|dibo|kemne|kivabe|koi|korbo|details|info|dimu)/i
  },
  {
    intent: 'HOW_TO_ORDER',
    // Matches thousands of order process requests
    regex: /(kivabe|kemne|how to|kibhabe|ki vabe|ki bhabe|kmn e)\s*(order|kinbo|nibo|kini|buy|purchase|pay|payment|process|niom|rules)/i
  },
  {
    intent: 'PASSWORD_RESET_INFO',
    // Matches thousands of password reset requests
    regex: /(password|pass|pas|pasword|pin|code)\s*(vule|bhule|mone nai|nai|haray|nosto|change|recover|reset|ki|dekhbo|jabo|bule|gesi|gechi|nai|jana nai)/i
  },
  {
    intent: 'WEBSITE_LINK',
    // Matches thousands of website link requests
    regex: /(website|site|link|url|app|address|store|shop)\s*(den|dao|din|diben|deben|kotha theke|kothay|pabo|ta den)/i
  },
  {
    intent: 'SUPPORT_CONTACT',
    // Matches thousands of support requests
    regex: /(support|contact|admin|help|sajjo|somossa|shomossa|problem|kotha|kaj korche na|kaj hocche na|nosto|block|banned)\s*(number|no|bolbo|chai|lagbe|korbo|hoise|ki korbo|hoyeche)/i
  },
  {
    intent: 'THANKS',
    regex: /^(thanks|dhonnobad|thank you|tk|thx|tq|tnx|ধন্যবাদ|থ্যাংকস|ty|thank u|jazakallah|sukriya|shukriya|valobasha|love you|thnx|jajakallah|alhamdulillah)(?:\s+(vai|vaiya|bhai|brother|bro|sir|boss))?\s*$/i
  },
  {
    intent: 'WARRANTY_INFO',
    // Matches thousands of warranty requests
    regex: /(warranty|guarantee|nischoyota|replace|waranty|warenty|garenti|guaranty|somossa hole|bondho hole|nonguarantee|koto din|koydin|mash|bochor)\s*(ase|pabo|ki korben|tikbe|cholbe|hobe|diben)/i
  },
  {
    intent: 'PRICE_INQUIRY',
    // Matches thousands of pricing requests
    regex: /(price|dam|koto|taka|tk|rate|discount|kom|monthly|yearly|subscription)\s*(koto|janben|bolen|rakhben|pabo|hobe|koto nibe|koto taka|niben|korben|ki)/i
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
