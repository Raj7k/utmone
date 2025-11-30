// Constants
const TEXT_MODE_KEY = 'text_mode';
const DEFAULT_MODE = 'minimal';

// List of acronyms to preserve
const ACRONYMS = ['UTM', 'API', 'QR', 'AI', 'URL', 'ID', 'HTTP', 'HTTPS', 'PDF', 'CSV', 'XLSX', 'SSO', 'SAML', 'OIDC', 'GA4', 'GTM'];

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

// Minimal mode: lowercase everything except acronyms
function toMinimalCase(text: string): string {
  return text.split(' ').map(word => {
    // Preserve acronyms
    if (ACRONYMS.includes(word.toUpperCase())) {
      return word.toUpperCase();
    }
    return word.toLowerCase();
  }).join(' ');
}

// Grammar mode: capitalize first letter, capitalize after periods
function toGrammarCase(text: string): string {
  // Split by sentence boundaries
  return text.split(/(\. )/).map((segment, index) => {
    if (segment === '. ') return segment;
    
    return segment.split(' ').map((word, wordIndex) => {
      // Preserve acronyms
      if (ACRONYMS.includes(word.toUpperCase())) {
        return word.toUpperCase();
      }
      // Capitalize first word of segment
      if (wordIndex === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    }).join(' ');
  }).join('');
}
