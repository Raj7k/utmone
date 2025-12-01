/**
 * Slug Scoring Hook
 * Scores slugs based on Readability, Length, and Complexity
 * Using principles from Surrogate Models (Optimization Chapter 17.1)
 */

// High-conversion keyword dictionary
const HIGH_CONVERSION_WORDS = [
  'sale', 'free', 'new', 'buy', 'get', 'save', 'deal', 'offer', 'limited',
  'today', 'now', 'fast', 'easy', 'best', 'top', 'quick', 'instant', 'win',
  'promo', 'discount', 'special', 'bonus', 'gift', 'exclusive', 'premium',
  'join', 'start', 'try', 'shop', 'discover', 'learn', 'register', 'signup'
];

// Common readable words for dictionary matching
const COMMON_WORDS = [
  ...HIGH_CONVERSION_WORDS,
  'summer', 'winter', 'spring', 'fall', 'black', 'friday', 'cyber', 'monday',
  'product', 'service', 'campaign', 'event', 'launch', 'guide', 'about',
  'contact', 'help', 'support', 'info', 'blog', 'news', 'update', 'year',
  'month', 'day', 'week', 'time', 'team', 'work', 'life', 'home'
];

/**
 * Calculate Levenshtein Distance between two strings
 * Used to measure complexity/similarity
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }
  return dp[m][n];
}

/**
 * Score a slug based on multiple optimization criteria
 */
export function useSlugScore() {
  const scoreSlug = (slug: string): {
    total: number;
    breakdown: {
      length: number;
      readability: number;
      complexity: number;
      conversion: number;
    };
  } => {
    if (!slug || slug.length === 0) {
      return { total: 0, breakdown: { length: 0, readability: 0, complexity: 0, conversion: 0 } };
    }

    // 1. Length Score (0-30 points) - Shorter is better
    const lengthScore = Math.max(0, 30 - slug.length * 0.5);

    // 2. Readability Score (0-40 points) - Dictionary word matching
    const words = slug.split('-');
    const matchedWords = words.filter(word => 
      COMMON_WORDS.includes(word.toLowerCase())
    );
    const readabilityScore = (matchedWords.length / Math.max(words.length, 1)) * 40;

    // 3. Complexity Score (0-20 points) - Penalty for mixed chars
    const hasNumbers = /\d/.test(slug);
    const hasLetters = /[a-z]/i.test(slug);
    const mixedComplexity = hasNumbers && hasLetters ? 10 : 20; // Mixed = penalty
    const specialCharsCount = (slug.match(/[^a-z0-9-]/gi) || []).length;
    const complexityScore = Math.max(0, mixedComplexity - specialCharsCount * 5);

    // 4. Conversion Score (0-10 points) - High-conversion keywords
    const conversionWords = words.filter(word =>
      HIGH_CONVERSION_WORDS.includes(word.toLowerCase())
    );
    const conversionScore = Math.min(10, conversionWords.length * 5);

    const total = Math.round(lengthScore + readabilityScore + complexityScore + conversionScore);

    return {
      total: Math.min(100, Math.max(0, total)),
      breakdown: {
        length: Math.round(lengthScore),
        readability: Math.round(readabilityScore),
        complexity: Math.round(complexityScore),
        conversion: Math.round(conversionScore),
      },
    };
  };

  return { scoreSlug, HIGH_CONVERSION_WORDS };
}
