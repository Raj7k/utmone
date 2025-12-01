/**
 * Slug Generator Hook
 * Generates 3 optimized slug suggestions: Shortest, Descriptive, Urgent
 */

import { useSlugScore } from './useSlugScore';

const URGENT_WORDS = ['expires-soon', 'limited', 'today-only', 'ends-tonight', 'last-chance', 'hurry', 'now', 'fast'];
const ACTION_WORDS = ['get', 'buy', 'shop', 'save', 'claim', 'grab', 'win', 'join'];

export function useSlugGenerator() {
  const { scoreSlug, HIGH_CONVERSION_WORDS } = useSlugScore();

  /**
   * Extract meaningful words from URL path and query
   */
  const extractKeywords = (url: string): string[] => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      const queryParams = Array.from(urlObj.searchParams.keys());
      
      // Combine path and query, clean up
      const allSegments = [...pathSegments, ...queryParams]
        .map(seg => seg.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
        .filter(seg => seg.length > 2 && seg !== 'index' && seg !== 'html');
      
      return allSegments;
    } catch {
      return [];
    }
  };

  /**
   * Generate SHORT slug - optimized for SMS/character limits
   */
  const generateShort = (url: string): string => {
    const keywords = extractKeywords(url);
    if (keywords.length === 0) return 'go';

    // Take first meaningful keyword and abbreviate
    const firstKeyword = keywords[0];
    
    // If it's a high-value word, keep it
    if (HIGH_CONVERSION_WORDS.includes(firstKeyword) && firstKeyword.length <= 5) {
      return firstKeyword;
    }

    // Otherwise, create initials or take first 4 chars
    if (firstKeyword.includes('-')) {
      const parts = firstKeyword.split('-');
      return parts.map(p => p[0]).join('').slice(0, 4);
    }

    return firstKeyword.slice(0, 4);
  };

  /**
   * Generate DESCRIPTIVE slug - optimized for trust and CTR
   */
  const generateDescriptive = (url: string): string => {
    const keywords = extractKeywords(url);
    if (keywords.length === 0) return 'visit-here';

    // Take first 2-3 meaningful keywords
    const meaningfulKeywords = keywords
      .filter(k => k.length >= 3)
      .slice(0, 3)
      .join('-');

    return meaningfulKeywords || keywords[0];
  };

  /**
   * Generate URGENT slug - optimized for action/conversion
   */
  const generateUrgent = (url: string): string => {
    const keywords = extractKeywords(url);
    
    // Prefer urgent/action words
    const urgentWord = URGENT_WORDS[Math.floor(Math.random() * URGENT_WORDS.length)];
    const actionWord = ACTION_WORDS[Math.floor(Math.random() * ACTION_WORDS.length)];

    // If URL contains sale/offer/deal, use that
    const hasOffer = keywords.some(k => 
      ['sale', 'offer', 'deal', 'promo', 'discount'].includes(k)
    );

    if (hasOffer) {
      return `${actionWord}-now`;
    }

    // Otherwise, combine action + urgency
    return urgentWord;
  };

  /**
   * Generate all 3 suggestions with scores
   */
  const generateSuggestions = (url: string) => {
    if (!url || url.trim().length === 0) {
      return [];
    }

    const short = generateShort(url);
    const descriptive = generateDescriptive(url);
    const urgent = generateUrgent(url);

    return [
      {
        slug: short,
        type: 'Shortest' as const,
        description: 'For SMS - Low cost',
        icon: '⚡',
        score: scoreSlug(short),
      },
      {
        slug: descriptive,
        type: 'Descriptive' as const,
        description: 'For Trust - High CTR',
        icon: '🎯',
        score: scoreSlug(descriptive),
      },
      {
        slug: urgent,
        type: 'Urgent' as const,
        description: 'For Action',
        icon: '🔥',
        score: scoreSlug(urgent),
      },
    ];
  };

  return { generateSuggestions, scoreSlug };
}
