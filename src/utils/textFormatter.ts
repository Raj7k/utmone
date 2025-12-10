// Constants
const TEXT_MODE_KEY = 'text_mode';
const DEFAULT_MODE = 'minimal';

// Comprehensive list of acronyms to preserve in uppercase
const ACRONYMS = [
  // Core Product
  'UTM', 'URL', 'QR', 'API', 'AI', 'ID', 'CTA',
  
  // Technical
  'OCR', 'SDK', 'MFA', 'JWT', 'DNS', 'CNAME', 'TXT', 'SSL', 'TLS',
  'HTTP', 'HTTPS', 'HTML', 'CSS', 'JSON', 'XML', 'CSV', 'PDF', 'XLSX',
  'REST', 'CDN', 'IP', 'VPN', 'NFC', 'RFID', 'UUID', 'GUID',
  
  // Authentication
  'SSO', 'SAML', 'OIDC', 'TOTP', 'OTP', 'PIN', '2FA',
  
  // Analytics & Marketing  
  'GA4', 'GTM', 'ROI', 'CTR', 'KPI', 'CPC', 'CPM', 'CAC', 'LTV',
  'ROAS', 'MRR', 'ARR', 'NPS', 'TAM', 'ABM', 'PPC', 'SEO', 'SEM',
  
  // Enterprise & Compliance
  'SLA', 'SOC', 'GDPR', 'CCPA', 'PII', 'DPA', 'RLS', 'HIPAA', 'RBAC',
  
  // Infrastructure
  'AWS', 'GCP', 'S3', 'EC2', 'VPC', 'CI', 'CD',
  
  // Business
  'CRM', 'ERP', 'B2B', 'B2C', 'CEO', 'CFO', 'CMO', 'CTO', 'VP', 'HR',
  
  // Platforms & Tech
  'USB', 'SQL', 'NoSQL', 'PNG', 'SVG', 'JPEG', 'WebP', 'GIF',
  
  // Product specific
  'FAQ', 'RSS', 'XML', 'YAML', 'CSV', 'XLS', 'DOC', 'PPT'
];

// Special case acronyms that need specific casing
const SPECIAL_CASE_ACRONYMS: Record<string, string> = {
  'SAAS': 'SaaS',
  'IOS': 'iOS',
  'IPADOS': 'iPadOS',
  'MACOS': 'macOS',
  'OAUTH': 'OAuth',
  'HUBSPOT': 'HubSpot',
  'BIGQUERY': 'BigQuery',
  'SNOWFLAKE': 'Snowflake',
  'ZAPIER': 'Zapier',
  'LINKEDIN': 'LinkedIn',
  'YOUTUBE': 'YouTube',
  'JAVASCRIPT': 'JavaScript',
  'TYPESCRIPT': 'TypeScript',
  'POSTGRESQL': 'PostgreSQL',
  'MONGODB': 'MongoDB',
  'GITHUB': 'GitHub',
  'GITLAB': 'GitLab',
  'WEBAUTHN': 'WebAuthn'
};

// Get current mode from localStorage
export function getTextMode(): 'minimal' | 'grammar' {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  return (localStorage.getItem(TEXT_MODE_KEY) as 'minimal' | 'grammar') || DEFAULT_MODE;
}

// Set text mode
export function setTextMode(mode: 'minimal' | 'grammar'): void {
  localStorage.setItem(TEXT_MODE_KEY, mode);
  window.dispatchEvent(new Event('text-mode-change'));
}

// Main formatting function
export function formatText(text: string, forceMode?: 'minimal' | 'grammar'): string {
  const mode = forceMode || getTextMode();
  
  if (mode === 'minimal') {
    return toMinimalCase(text);
  } else {
    return toGrammarCase(text);
  }
}

// Process a single word for acronym preservation
function processWord(word: string): string {
  // Extract the core word without punctuation
  const match = word.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9]+)([^a-zA-Z0-9]*)$/);
  if (!match) return word;
  
  const [, prefix, core, suffix] = match;
  const upperCore = core.toUpperCase();
  
  // Check special case acronyms first
  if (SPECIAL_CASE_ACRONYMS[upperCore]) {
    return prefix + SPECIAL_CASE_ACRONYMS[upperCore] + suffix;
  }
  
  // Check standard acronyms
  if (ACRONYMS.includes(upperCore)) {
    return prefix + upperCore + suffix;
  }
  
  return word;
}

// Minimal mode: lowercase everything except acronyms
function toMinimalCase(text: string): string {
  return text.split(/(\s+)/).map(segment => {
    if (/^\s+$/.test(segment)) return segment;
    
    // First lowercase, then process for acronyms
    const lowered = segment.toLowerCase();
    return processWord(lowered);
  }).join('');
}

// Grammar mode: capitalize first letter, capitalize after periods
function toGrammarCase(text: string): string {
  // Split by sentence boundaries
  return text.split(/(\. )/).map((segment, index) => {
    if (segment === '. ') return segment;
    
    return segment.split(/(\s+)/).map((word, wordIndex) => {
      if (/^\s+$/.test(word)) return word;
      
      // First lowercase, then check acronyms
      const lowered = word.toLowerCase();
      const processed = processWord(lowered);
      
      // If acronym was found, it's already processed
      if (processed !== lowered) return processed;
      
      // Capitalize first word of segment
      if (wordIndex === 0 && word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    }).join('');
  }).join('');
}

// Standalone utility to preserve acronyms in any text without mode switching
export function preserveAcronyms(text: string): string {
  return text.split(/(\s+)/).map(segment => {
    if (/^\s+$/.test(segment)) return segment;
    return processWord(segment);
  }).join('');
}

// Short alias for inline use in JSX
export const p = preserveAcronyms;
