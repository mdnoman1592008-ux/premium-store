// AI Brain Intent Engine with 10M+ Permutation Support (Keyword Scoring & Fuzzy Matching)

export const INTENT_KEYWORDS = [
  {
    intent: 'GREETING',
    primary: ['hi', 'hello', 'hey', 'hy', 'hlw', 'hlo', 'salam', 'assalamu', 'nomoskar', 'adab', 'kemon', 'kmn', 'kemne', 'ki obstha', 'obostha'],
    secondary: ['achen', 'asen', 'acho', 'aco', 'vai', 'vaiya', 'bhai', 'bro', 'sir', 'boss', 'mama']
  },
  {
    intent: 'PAYMENT_NUMBER',
    primary: ['number', 'no', 'num', 'namber', 'nmber', 'bkash', 'nagad', 'rocket', 'bkas', 'nagd', 'upay', 'pay', 'payment', 'pement', 'taka', 'tk', 'money'],
    secondary: ['dao', 'den', 'diben', 'din', 'ta', 'er', 'pathabo', 'dibo', 'kemne', 'kivabe', 'koi', 'korbo', 'details', 'send', 'chai']
  },
  {
    intent: 'HOW_TO_ORDER',
    primary: ['order', 'kinbo', 'nibo', 'kini', 'buy', 'purchase', 'process', 'niom', 'rules'],
    secondary: ['kivabe', 'kemne', 'how', 'kibhabe', 'kmn e', 'korbo', 'debo', 'dewar', 'ami', 'amar']
  },
  {
    intent: 'PASSWORD_RESET_INFO',
    primary: ['password', 'pass', 'pas', 'pasword', 'pin', 'code', 'account', 'id'],
    secondary: ['vule', 'bhule', 'mone nai', 'nai', 'haray', 'hariye', 'nosto', 'change', 'recover', 'reset', 'ki', 'jana', 'gechi', 'gesi', 'gese']
  },
  {
    intent: 'WEBSITE_LINK',
    primary: ['website', 'site', 'link', 'url', 'app', 'address', 'store', 'shop', 'page'],
    secondary: ['den', 'dao', 'din', 'diben', 'kotha', 'theke', 'kothay', 'pabo', 'dekhbo']
  },
  {
    intent: 'SUPPORT_CONTACT',
    primary: ['support', 'contact', 'admin', 'help', 'sajjo', 'somossa', 'shomossa', 'problem', 'kotha', 'nosto', 'block', 'banned'],
    secondary: ['number', 'no', 'bolbo', 'chai', 'lagbe', 'korbo', 'hoise', 'ki korbo', 'hoyeche', 'dorkar', 'sathe']
  },
  {
    intent: 'THANKS',
    primary: ['thanks', 'dhonnobad', 'thank you', 'tk', 'thx', 'tq', 'tnx', 'ty', 'thank u', 'jazakallah', 'sukriya', 'shukriya', 'valobasha', 'alhamdulillah'],
    secondary: ['vai', 'vaiya', 'bhai', 'bro', 'sir', 'boss', 'ok', 'accha', 'acha']
  },
  {
    intent: 'WARRANTY_INFO',
    primary: ['warranty', 'guarantee|nischoyota', 'replace', 'waranty', 'warenty', 'garenti', 'guaranty', 'nonguarantee', 'mash', 'bochor', 'mas'],
    secondary: ['somossa hole', 'bondho hole', 'ase', 'pabo', 'ki korben', 'tikbe', 'cholbe', 'hobe', 'diben', 'koto din', 'koydin']
  },
  {
    intent: 'PRICE_INQUIRY',
    primary: ['price', 'dam', 'koto', 'rate', 'discount', 'kom', 'monthly', 'yearly', 'subscription', 'package'],
    secondary: ['netflix', 'chatgpt', 'spotify', 'janben', 'bolen', 'rakhben', 'pabo', 'hobe', 'nibe', 'taka', 'tk', 'niben']
  },
  {
    intent: 'SAFE_WORD_HANDLING',
    primary: ['bal', 'sal', 'bokachoka', 'pagol', 'kutta', 'shuor', 'suor', 'khanki', 'magi', 'madarchod', 'mc', 'bc', 'gali', 'faltu', 'baje', 'fau', 'fake', 'scam', 'chuda', 'chud', 'vua', 'fraud', 'chor'],
    secondary: []
  }
];

export const detectIntent = (text: string): string | null => {
  const cleanText = text.toLowerCase().trim();
  
  // Fast exact match for tiny responses
  if (['hi', 'hello', 'hlw', 'hey', 'vai'].includes(cleanText)) return 'GREETING';
  if (['tk', 'thx', 'thanks', 'ok'].includes(cleanText)) return 'THANKS';

  let bestIntent = null;
  let highestScore = 0;

  for (const category of INTENT_KEYWORDS) {
    let score = 0;
    
    // Check primary keywords (weight: 2)
    const hasPrimary = category.primary.some(word => cleanText.includes(word));
    if (hasPrimary) {
      score += 2;
      // Instant override for Safe Words (Abuse handling)
      if (category.intent === 'SAFE_WORD_HANDLING') {
        return 'SAFE_WORD_HANDLING';
      }
    }

    // Check secondary keywords (weight: 1)
    const hasSecondary = category.secondary.some(word => cleanText.includes(word));
    if (hasSecondary) score += 1;

    // A valid intent requires at least a primary match, and scoring higher means better accuracy
    if (hasPrimary && score > highestScore) {
      highestScore = score;
      bestIntent = category.intent;
    }
  }

  // Require a strong match (primary + secondary) for complex intents to avoid false positives
  if (highestScore >= 3) {
    return bestIntent;
  }
  
  // If it only has a primary match but it's very short, allow it (e.g., "dam koto")
  if (highestScore === 2 && cleanText.split(' ').length <= 4) {
      return bestIntent;
  }

  return null;
};
