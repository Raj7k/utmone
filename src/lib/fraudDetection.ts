export interface FraudRisk {
  score: number;
  factors: string[];
}

const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'java'
];

export function calculateFraudRisk(
  userAgent: string,
  referrer: string | null,
  recentClickCount: number
): FraudRisk {
  let score = 0;
  const factors: string[] = [];

  // Bot detection
  if (isBotUserAgent(userAgent)) {
    score += 50;
    factors.push('bot_user_agent');
  }

  // Missing referrer
  if (!referrer) {
    score += 10;
    factors.push('no_referrer');
  }

  // High click velocity (>10 clicks in last minute)
  if (recentClickCount > 10) {
    score += 30;
    factors.push('high_click_velocity');
  }

  // Very short user agent
  if (userAgent.length < 20) {
    score += 15;
    factors.push('suspicious_user_agent');
  }

  return { score, factors };
}

function isBotUserAgent(userAgent: string): boolean {
  const lowerUA = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => lowerUA.includes(bot));
}
