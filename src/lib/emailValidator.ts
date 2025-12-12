// Smart Guard Email Validator
// 3-Layer Defense: Syntax → Burner → Typo

const DISPOSABLE_DOMAINS = new Set([
  // Common disposable email providers
  'yopmail.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'throwawaymail.com', 'temp-mail.org', 'fakeinbox.com',
  'getnada.com', 'maildrop.cc', 'dispostable.com', 'emailondeck.com',
  'mohmal.com', 'tempail.com', 'trashmail.com', 'guerrillamail.info',
  'sharklasers.com', 'grr.la', 'spam4.me', 'pokemail.net',
  'discard.email', 'spamgourmet.com', 'mintemail.com', 'tempr.email',
  'inboxalias.com', 'jetable.org', 'tempinbox.com', 'mytemp.email',
  '10minutemail.net', 'mail-temp.com', 'dropmail.me', 'emailfake.com',
  'tempmailo.com', 'emailtemporario.com.br', 'temp-mail.io', 'mailcatch.com',
  // Additional garbage domains
  'asdf.com', 'test.com', 'example.com', 'fake.com', 'noemail.com',
  'none.com', 'notreal.com', 'invalid.com', 'nomail.com',
]);

const COMMON_TYPOS: Record<string, string> = {
  // Gmail typos
  'gmil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cpm': 'gmail.com',
  'g]mail.com': 'gmail.com',
  
  // Hotmail/Outlook typos
  'hotmal.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.cm': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlook.cm': 'outlook.com',
  'outllook.com': 'outlook.com',
  
  // Yahoo typos
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',
  
  // iCloud typos
  'iclou.com': 'icloud.com',
  'icloud.co': 'icloud.com',
  'icoud.com': 'icloud.com',
  
  // Common TLD typos
  '.cmo': '.com',
  '.ocm': '.com',
};

// Garbage name patterns (before @)
const GARBAGE_NAME_PATTERNS = [
  /^[a-z]{1,2}$/i,           // Single/double letter names
  /^[0-9]+$/,                 // Only numbers
  /^test/i,                   // Starts with test
  /^asdf/i,                   // Keyboard mash
  /^qwer/i,                   // Keyboard mash
  /^zxcv/i,                   // Keyboard mash
  /^aaa+$/i,                  // Repeated letters
  /^fake/i,                   // Starts with fake
  /^none/i,                   // Starts with none
  /^no[-_]?reply/i,           // No-reply addresses
  /^admin$/i,                 // Generic admin
  /^user$/i,                  // Generic user
  /^example$/i,               // Example
];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
  severity?: 'error' | 'warning';
}

export const validateEmailSmart = (email: string): ValidationResult => {
  if (!email) return { isValid: false };

  const trimmedEmail = email.trim().toLowerCase();

  // 1. Syntax Check (Basic RFC 5322)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { 
      isValid: false, 
      error: "please enter a valid email address",
      severity: 'error'
    };
  }

  const [localPart, domain] = trimmedEmail.split('@');

  // 2. Garbage Name Check
  for (const pattern of GARBAGE_NAME_PATTERNS) {
    if (pattern.test(localPart)) {
      return { 
        isValid: false, 
        error: "please use a real email address",
        severity: 'error'
      };
    }
  }

  // 3. Burner/Disposable Domain Check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { 
      isValid: false, 
      error: "disposable emails are not allowed. please use your work or personal email.",
      severity: 'error'
    };
  }

  // 4. Typo Check with Suggestions
  if (COMMON_TYPOS[domain]) {
    const correction = COMMON_TYPOS[domain];
    const suggestedEmail = trimmedEmail.replace(domain, correction);
    return { 
      isValid: false, 
      error: `did you mean ${correction}?`,
      suggestion: suggestedEmail,
      severity: 'warning'
    };
  }

  // 5. Check for common TLD typos in any domain
  for (const [typo, fix] of Object.entries(COMMON_TYPOS)) {
    if (typo.startsWith('.') && domain.endsWith(typo.slice(1))) {
      const fixedDomain = domain.slice(0, -typo.length + 1) + fix.slice(1);
      const suggestedEmail = `${localPart}@${fixedDomain}`;
      return { 
        isValid: false, 
        error: `did you mean ${fixedDomain}?`,
        suggestion: suggestedEmail,
        severity: 'warning'
      };
    }
  }

  // 6. Basic MX-like validation (check for valid-looking domain)
  const domainParts = domain.split('.');
  if (domainParts.length < 2 || domainParts.some(part => part.length === 0)) {
    return { 
      isValid: false, 
      error: "please enter a valid domain",
      severity: 'error'
    };
  }

  return { isValid: true };
};

// Quick check for real-time validation (less strict, for typing)
export const isEmailLikelyValid = (email: string): boolean => {
  if (!email || email.length < 5) return false;
  const hasAt = email.includes('@');
  const hasDot = email.includes('.');
  return hasAt && hasDot;
};
