/**
 * Invite Fraud Detection using Outlier Detection
 * Based on Chapter 20: Probabilistic Uncertainty
 * Detect anomalies in invite patterns
 */

export type RiskLevel = 'low' | 'medium' | 'high';

export interface FraudCheckResult {
  allowed: boolean;
  riskLevel: RiskLevel;
  reasons: string[];
  score: number; // 0-100, higher = more suspicious
}

// Known disposable email domains
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'throwaway.email',
  'mailinator.com',
  'yopmail.com',
  'temp-mail.org',
  'getnada.com',
  'maildrop.cc',
  'trashmail.com'
];

/**
 * Check for email aliasing patterns (low entropy)
 * e.g., user+1@gmail.com, user+2@gmail.com
 */
function detectEmailAliasing(email: string, senderEmail: string): boolean {
  // Check for + alias pattern
  if (email.includes('+')) {
    const [localPart] = email.split('@');
    const baseEmail = localPart.split('+')[0];
    const [senderLocal] = senderEmail.split('@');
    
    // If base matches sender's email, it's suspicious
    if (baseEmail === senderLocal || baseEmail === senderLocal.split('+')[0]) {
      return true;
    }
  }

  // Check for sequential number patterns
  const numberMatch = email.match(/\d+$/);
  if (numberMatch) {
    const number = parseInt(numberMatch[0]);
    // Numbers 1-9 are highly suspicious (user1, user2, etc.)
    if (number >= 1 && number <= 9) {
      return true;
    }
  }

  return false;
}

/**
 * Check if domain is disposable/temporary email provider
 */
function isDisposableDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}

/**
 * Check for rapid-fire invites (velocity attack)
 * lastInviteTimestamp should be from database query
 */
function checkVelocity(lastInviteTimestamp: Date | null, thresholdSeconds: number = 5): boolean {
  if (!lastInviteTimestamp) return false;
  
  const secondsSinceLastInvite = (Date.now() - lastInviteTimestamp.getTime()) / 1000;
  return secondsSinceLastInvite < thresholdSeconds;
}

/**
 * Check for sequential pattern in recently invited emails
 * e.g., john1@, john2@, john3@ within short time
 */
export function detectSequentialPattern(recentEmails: string[]): boolean {
  if (recentEmails.length < 2) return false;

  // Extract base names (without numbers and domains)
  const bases = recentEmails.map(email => {
    const [local] = email.split('@');
    return local.replace(/\d+$/, '').toLowerCase();
  });

  // Check if multiple emails share the same base
  const uniqueBases = new Set(bases);
  if (uniqueBases.size < bases.length) {
    return true; // Found duplicates
  }

  return false;
}

/**
 * Main fraud detection function
 * Combines multiple heuristics to calculate risk score
 */
export function checkInviteRisk(params: {
  targetEmail: string;
  senderEmail: string;
  lastInviteTimestamp: Date | null;
  recentInviteEmails: string[];
}): FraudCheckResult {
  const { targetEmail, senderEmail, lastInviteTimestamp, recentInviteEmails } = params;
  
  let score = 0;
  const reasons: string[] = [];

  // Check 1: Velocity (rapid invites)
  if (checkVelocity(lastInviteTimestamp, 5)) {
    score += 40;
    reasons.push('Rapid-fire invites detected (bot behavior)');
  }

  // Check 2: Email aliasing
  if (detectEmailAliasing(targetEmail, senderEmail)) {
    score += 30;
    reasons.push('Email alias pattern detected');
  }

  // Check 3: Disposable domain
  if (isDisposableDomain(targetEmail)) {
    score += 20;
    reasons.push('Disposable email domain');
  }

  // Check 4: Sequential pattern
  if (detectSequentialPattern([...recentInviteEmails, targetEmail])) {
    score += 10;
    reasons.push('Sequential email pattern detected');
  }

  // Determine risk level and decision
  let riskLevel: RiskLevel;
  let allowed: boolean;

  if (score >= 60) {
    riskLevel = 'high';
    allowed = false; // Block
  } else if (score >= 30) {
    riskLevel = 'medium';
    allowed = true; // Allow with warning
  } else {
    riskLevel = 'low';
    allowed = true;
  }

  return {
    allowed,
    riskLevel,
    reasons,
    score
  };
}
