/**
 * User-friendly error message mapping
 * Converts technical database errors to human-readable messages
 */

// Generic email domains that should use global workspace uniqueness
export const GENERIC_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'zoho.com',
  'yandex.com',
  'gmx.com',
  'fastmail.com',
];

// Error code to friendly message mapping
const ERROR_MESSAGES: Record<string, Record<string, string> | string> = {
  // PostgreSQL unique constraint violations
  '23505': {
    'workspaces_slug_key': 'this workspace name is already taken. please try a different name.',
    'links_domain_path_slug_key': 'this short link already exists. please try a different slug.',
    'domains_domain_key': 'this domain is already registered.',
    'profiles_email_key': 'an account with this email already exists.',
    default: 'this item already exists. please try a different name.',
  },
  // Foreign key violations
  '23503': 'this action cannot be completed because it references other items.',
  // Row not found
  'PGRST116': 'the requested item was not found.',
  // Permission denied
  '42501': 'you don\'t have permission to perform this action.',
  // Connection errors
  '08006': 'unable to connect. please check your internet connection.',
  // Rate limiting
  '429': 'too many requests. please wait a moment and try again.',
};

/**
 * Get user-friendly error message from database error
 */
export const getFriendlyErrorMessage = (error: any): string => {
  if (!error) return 'something went wrong. please try again.';

  const code = error.code || error.status?.toString();
  const constraint = error.constraint || error.details?.match(/constraint "([^"]+)"/)?.[1];

  // Check for specific error code
  if (code && ERROR_MESSAGES[code]) {
    const mapping = ERROR_MESSAGES[code];
    
    if (typeof mapping === 'string') {
      return mapping;
    }
    
    // Check for specific constraint
    if (constraint && mapping[constraint]) {
      return mapping[constraint];
    }
    
    // Return default for this error code
    return mapping.default || 'something went wrong. please try again.';
  }

  // Network errors
  if (error.message?.toLowerCase().includes('network') || 
      error.message?.toLowerCase().includes('fetch') ||
      error.message?.toLowerCase().includes('connection')) {
    return 'unable to connect. please check your internet connection.';
  }

  // Timeout errors
  if (error.message?.toLowerCase().includes('timeout')) {
    return 'the request took too long. please try again.';
  }

  // Default fallback - don't expose technical details
  return 'something went wrong. please try again.';
};

/**
 * Extract domain from email address
 */
export const getEmailDomain = (email: string): string => {
  const parts = email.split('@');
  return parts[1]?.toLowerCase() || '';
};

/**
 * Check if email domain is a generic/public email provider
 */
export const isGenericEmailDomain = (email: string): boolean => {
  const domain = getEmailDomain(email);
  return GENERIC_EMAIL_DOMAINS.includes(domain);
};
