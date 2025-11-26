/**
 * Smart URL Parser
 * Detects platforms and extracts meaningful identifiers for readable slug generation
 */

interface PlatformPattern {
  regex: RegExp;
  type: string;
  extract: number | number[];
}

interface PlatformConfig {
  hostname: RegExp;
  patterns: PlatformPattern[];
}

const PLATFORM_PATTERNS: Record<string, PlatformConfig> = {
  linkedin: {
    hostname: /linkedin\.com$/,
    patterns: [
      { regex: /\/in\/([^/?#]+)/, type: 'profile', extract: 1 },
      { regex: /\/company\/([^/?#]+)/, type: 'company', extract: 1 },
      { regex: /\/posts\/([^/?#]+)/, type: 'post', extract: 1 },
      { regex: /\/pulse\/([^/?#]+)/, type: 'article', extract: 1 },
    ]
  },
  twitter: {
    hostname: /(twitter\.com|x\.com)$/,
    patterns: [
      { regex: /\/status\/(\d+)/, type: 'tweet', extract: 1 },
      { regex: /\/([^/?#]+)\/?$/, type: 'profile', extract: 1 },
    ]
  },
  youtube: {
    hostname: /(youtube\.com|youtu\.be)$/,
    patterns: [
      { regex: /\/watch\?v=([^&#]+)/, type: 'video', extract: 1 },
      { regex: /youtu\.be\/([^?#]+)/, type: 'video', extract: 1 },
      { regex: /\/@([^/?#]+)/, type: 'channel', extract: 1 },
      { regex: /\/channel\/([^/?#]+)/, type: 'channel', extract: 1 },
    ]
  },
  github: {
    hostname: /github\.com$/,
    patterns: [
      { regex: /\/([^/]+)\/([^/?#]+)$/, type: 'repo', extract: [1, 2] },
      { regex: /\/([^/?#]+)\/?$/, type: 'user', extract: 1 },
    ]
  },
  instagram: {
    hostname: /instagram\.com$/,
    patterns: [
      { regex: /\/p\/([^/?#]+)/, type: 'post', extract: 1 },
      { regex: /\/reel\/([^/?#]+)/, type: 'reel', extract: 1 },
      { regex: /\/([^/?#]+)\/?$/, type: 'profile', extract: 1 },
    ]
  },
  medium: {
    hostname: /medium\.com$/,
    patterns: [
      { regex: /@([^/?#]+)\/([^/?#]+)/, type: 'article', extract: [1, 2] },
      { regex: /@([^/?#]+)/, type: 'author', extract: 1 },
    ]
  },
  facebook: {
    hostname: /facebook\.com$/,
    patterns: [
      { regex: /\/([^/?#]+)\/?$/, type: 'page', extract: 1 },
    ]
  },
  tiktok: {
    hostname: /tiktok\.com$/,
    patterns: [
      { regex: /\/@([^/?#]+)\/video\/(\d+)/, type: 'video', extract: [1, 2] },
      { regex: /\/@([^/?#]+)/, type: 'profile', extract: 1 },
    ]
  }
};

function cleanSlugPart(part: string): string {
  // Remove special characters, convert to lowercase, limit length
  return part
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 20);
}

function detectPlatform(hostname: string): string | null {
  for (const [platform, config] of Object.entries(PLATFORM_PATTERNS)) {
    if (config.hostname.test(hostname)) {
      return platform;
    }
  }
  return null;
}

function extractIdentifier(url: string, platform: string): string | null {
  const config = PLATFORM_PATTERNS[platform];
  if (!config) return null;

  const urlObj = new URL(url);
  const pathname = urlObj.pathname;

  for (const pattern of config.patterns) {
    const match = pathname.match(pattern.regex);
    if (match) {
      if (Array.isArray(pattern.extract)) {
        // Multiple captures (e.g., github user/repo)
        const parts = pattern.extract.map(i => match[i]).filter(Boolean);
        return parts.map(cleanSlugPart).join('-');
      } else {
        // Single capture
        return cleanSlugPart(match[pattern.extract]);
      }
    }
  }

  return null;
}

export function generateSmartSlug(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '');
    
    // Detect platform
    const platform = detectPlatform(hostname);
    
    if (platform) {
      // Extract meaningful identifier
      const identifier = extractIdentifier(url, platform);
      
      if (identifier) {
        // Return platform-identifier format
        return `${platform}-${identifier}`;
      }
    }

    // Fallback: use domain + first path segment
    const domain = hostname.split('.')[0];
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathParts.length > 0) {
      const firstPart = cleanSlugPart(pathParts[0]);
      return `${cleanSlugPart(domain)}-${firstPart}`;
    }

    // Final fallback: just domain + random
    return `${cleanSlugPart(domain)}-${Math.random().toString(36).substring(2, 8)}`;
    
  } catch (error) {
    // If URL parsing fails, return random slug
    return Math.random().toString(36).substring(2, 10);
  }
}

export function getPlatformInfo(url: string): { platform: string | null; type: string | null } {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '');
    const platform = detectPlatform(hostname);
    
    if (platform) {
      const config = PLATFORM_PATTERNS[platform];
      for (const pattern of config.patterns) {
        if (pattern.regex.test(urlObj.pathname)) {
          return { platform, type: pattern.type };
        }
      }
      return { platform, type: null };
    }
    
    return { platform: null, type: null };
  } catch {
    return { platform: null, type: null };
  }
}
