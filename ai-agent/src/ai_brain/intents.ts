export const INTENT_PATTERNS = [
  {
    intent: 'GREETING',
    regex: /^(?:ki\s+)?(?:hello|helo|hlo|hlw|hi|hii|hiii|hy|hey|salam|assalamu\s*alaikum|namaskar|nomoskar|adab|yoo|oy|oee|oi|ki\s*obstha|obostha|kemon|kmn|kemne)\s*(?:achen|asen|aso|asis|acho|aco|aca|ase)?\s*(?:vai|vaiya|bhai|brother|bro|sir|boss|mama|mumu)?\s*$/i
  },
  {
    intent: 'PAYMENT_NUMBER',
    // Matches: "bhai ektu number ta dao", "bkash no den plz", "kemne taka pathabo", "send money no diben", "payment details", etc.
    regex: /(?:vai|bhai|plz|pls|ektu)?\s*(number|no|num|namber|numbr|nmber|taka|tk|money|pay|pement|payment|bkash|bkas|bksh|nagad|nagd|rocket|roket|rokrt|upay)\s*(?:ta|er)?\s*(dao|den|deben|diben|din|pathabo|dibo|kemne|kivabe|koi|korbo|details|info|dimu|deb|send|korte|chai)/i
  },
  {
    intent: 'HOW_TO_ORDER',
    // Matches: "ami kivabe order korbo", "kinar process ki", "kemne nibo ektu bolen", "purchase rules ki", etc.
    regex: /(?:ami|amar|ektu|plz)?\s*(kivabe|kemne|how to|kibhabe|ki vabe|ki bhabe|kmn e|kmn kore|kemne kore)\s*(order|kinbo|nibo|kini|buy|purchase|process|niom|rules|korbo|debo|dewar)/i
  },
  {
    intent: 'PASSWORD_RESET_INFO',
    // Matches: "amar password mone nai", "bhai pass vule gesi", "account a dhukte parchi na", "pin haray felse", etc.
    regex: /(?:amar|ami)?\s*(password|pass|pas|pasword|pin|code|account|id)\s*(?:er)?\s*(vule|bhule|bule|mone nai|mone nay|nai|haray|hariye|nosto|change|recover|reset|ki|jana nai|dekhbo|jabo|gesi|gechi|gese|parchi na|hocche na|nosto hoise)/i
  },
  {
    intent: 'WEBSITE_LINK',
    // Matches: "apnader website link den", "site url ta dao", "app link ki", "kotha theke kinbo", etc.
    regex: /(?:apnader)?\s*(website|site|link|url|app|address|store|shop|page|group)\s*(?:er|ta)?\s*(den|dao|din|diben|deben|kotha theke|kothay|pabo|ki|dekhbo)/i
  },
  {
    intent: 'SUPPORT_CONTACT',
    // Matches: "bhai admin er number lagbe", "somossa hoise kotha bolbo", "support helpline ki", "kaj korche na help lagbe", etc.
    regex: /(support|contact|admin|help|sajjo|sahajjo|somossa|shomossa|problem|kotha|kaj korche na|kaj hocche na|nosto|block|banned|parchi na|hoyeche)\s*(number|no|bolbo|chai|lagbe|korbo|hoise|ki korbo|hoyeche|den|dao|dorkar|sathe)/i
  },
  {
    intent: 'THANKS',
    regex: /^(?:ok|accha|acha)?\s*(thanks|dhonnobad|thank you|tk|thx|tq|tnx|ধন্যবাদ|থ্যাংকস|ty|thank u|jazakallah|sukriya|shukriya|valobasha|love you|thnx|jajakallah|alhamdulillah)(?:\s+(vai|vaiya|bhai|brother|bro|sir|boss))?\s*$/i
  },
  {
    intent: 'WARRANTY_INFO',
    // Matches: "somossa hole ki replace pabo", "koto din warranty ase", "nonguarantee naki", "tikbe to", etc.
    regex: /(warranty|guarantee|nischoyota|replace|waranty|warenty|garenti|guaranty|somossa hole|bondho hole|nonguarantee|koto din|koydin|mash|bochor|koy mas|koto mas)\s*(ase|pabo|ki korben|tikbe|cholbe|hobe|diben|diba|jabe)/i
  },
  {
    intent: 'PRICE_INQUIRY',
    // Matches: "bhai netflix er dam koto", "monthly price ki kom hobe", "subscription rate janben", "koto tk lagbe", etc.
    regex: /(?:bhai|vai|vaiya)?\s*(?:netflix|chatgpt|spotify|prime|canva|chorki|hoichoi)?\s*(?:er)?\s*(price|dam|koto|taka|tk|rate|discount|kom|monthly|yearly|subscription|package)\s*(koto|janben|bolen|rakhben|pabo|hobe|koto nibe|koto taka|niben|korben|ki|niba)/i
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
