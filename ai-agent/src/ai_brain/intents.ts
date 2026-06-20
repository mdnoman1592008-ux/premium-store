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

// Phonetic Normalization (Soundex-style) to handle Banglish pronunciation shifts
const phoneticNormalize = (word: string): string => {
  return word
    .replace(/bh/g, 'v')
    .replace(/ph/g, 'f')
    .replace(/sh/g, 's')
    .replace(/ch/g, 'c')
    .replace(/z/g, 'j')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/ou/g, 'o')
    .replace(/(.)\1+/g, '$1'); // Remove double letters (e.g., 'bhalll' -> 'bhal' -> 'val')
};

// Lightweight Levenshtein Distance for mathematical fuzzy matching
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
      }
    }
  }
  return matrix[b.length][a.length];
};

const isFuzzyMatch = (inputWords: string[], targetKeyword: string): boolean => {
  const normTarget = phoneticNormalize(targetKeyword);
  if (inputWords.includes(targetKeyword)) return true;
  
  for (const rawWord of inputWords) {
    const word = phoneticNormalize(rawWord);
    if (word === normTarget) return true;
    
    if (Math.abs(word.length - normTarget.length) > 2) continue;
    const allowedDistance = normTarget.length >= 6 ? 2 : (normTarget.length >= 4 ? 1 : 0);
    if (allowedDistance > 0 && levenshteinDistance(word, normTarget) <= allowedDistance) {
      return true;
    }
  }
  return false;
};

export const detectIntent = (text: string): string | null => {
  const cleanText = text.toLowerCase().trim();
  const inputWords = cleanText.split(/[\s,!?.]+/);
  
  // Fast exact match for tiny responses
  if (['hi', 'hello', 'hlw', 'hey', 'vai'].includes(cleanText)) return 'GREETING';
  if (['tk', 'thx', 'thanks', 'ok'].includes(cleanText)) return 'THANKS';

  let bestIntent = null;
  let highestScore = 0;

  for (const category of INTENT_KEYWORDS) {
    let score = 0;
    
    // Check primary keywords (weight: 2) with fuzzy math
    const hasPrimary = category.primary.some(word => isFuzzyMatch(inputWords, word) || cleanText.includes(word));
    if (hasPrimary) {
      score += 2;
      // Instant override for Safe Words (Abuse handling)
      if (category.intent === 'SAFE_WORD_HANDLING') {
        return 'SAFE_WORD_HANDLING';
      }
    }

    // Check secondary keywords (weight: 1)
    const hasSecondary = category.secondary.some(word => isFuzzyMatch(inputWords, word) || cleanText.includes(word));
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
  if (highestScore === 2 && inputWords.length <= 4) {
      return bestIntent;
  }

  return null;
};
