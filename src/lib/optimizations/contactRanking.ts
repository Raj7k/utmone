/**
 * Smart Contact Ranking using Nondomination Ranking
 * Based on Chapter 15: Multiobjective Optimization
 */

export interface Contact {
  name: string;
  email: string;
  domain: string;
  jobTitle?: string;
  lastContactDate?: Date;
}

export interface RankedContact extends Contact {
  score: number;
  tier: number;
  reasons: string[];
}

/**
 * Rank contacts using multiobjective optimization
 * Objectives: Domain match, Recency, Role fit
 */
export function rankContacts(
  contacts: Contact[],
  workspaceDomain: string,
  targetRoles: string[] = ['marketing', 'growth', 'social', 'dev', 'product']
): RankedContact[] {
  const scored = contacts.map(contact => {
    let score = 0;
    const reasons: string[] = [];

    // Objective 1: Domain Match (Weight: High = 50 points)
    const contactDomain = contact.email.split('@')[1]?.toLowerCase();
    if (contactDomain === workspaceDomain.toLowerCase()) {
      score += 50;
      reasons.push('Same organization');
    }

    // Objective 2: Role Fit (Weight: Medium = 10 points)
    const emailLower = contact.email.toLowerCase();
    const titleLower = contact.jobTitle?.toLowerCase() || '';
    
    for (const role of targetRoles) {
      if (emailLower.includes(role) || titleLower.includes(role)) {
        score += 10;
        reasons.push(`Role match: ${role}`);
        break;
      }
    }

    // Objective 3: Recency (Weight: Low = 5 points)
    if (contact.lastContactDate) {
      const daysSinceContact = Math.floor(
        (Date.now() - contact.lastContactDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceContact < 30) {
        score += 5;
        reasons.push('Recent contact');
      }
    }

    return {
      ...contact,
      score,
      tier: 0, // Will be assigned based on nondomination
      reasons
    };
  });

  // Assign tiers using Nondomination Ranking
  // Tier 1: Domain Match + Role Match (score >= 60)
  // Tier 2: Domain Match only (score >= 50)
  // Tier 3: Role Match only (score >= 10)
  // Tier 4: Others
  scored.forEach(contact => {
    if (contact.score >= 60) contact.tier = 1;
    else if (contact.score >= 50) contact.tier = 2;
    else if (contact.score >= 10) contact.tier = 3;
    else contact.tier = 4;
  });

  // Sort by tier, then score
  return scored.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return b.score - a.score;
  });
}
