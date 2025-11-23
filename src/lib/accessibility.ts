import type { LinkDetail } from "@/hooks/useLinkDetail";

/**
 * Generate accessible ARIA labels for links
 */
export const generateLinkAriaLabel = (link: { 
  title: string; 
  domain: string; 
  total_clicks?: number | null;
  status?: string;
}) => {
  const clicks = link.total_clicks || 0;
  const clicksText = clicks === 1 ? '1 click' : `${clicks} clicks`;
  const statusText = link.status ? `, status: ${link.status}` : '';
  
  return `Link to ${link.title || 'untitled'} on ${link.domain}. ${clicksText}${statusText}. Click to view details.`;
};

/**
 * Generate accessible ARIA labels for buttons
 */
export const generateButtonAriaLabel = (action: string, context?: string) => {
  return context ? `${action} for ${context}` : action;
};

/**
 * Generate accessible ARIA labels for table rows
 */
export const generateTableRowAriaLabel = (link: {
  title: string;
  short_url?: string | null;
  total_clicks?: number | null;
  status?: string;
}) => {
  const clicks = link.total_clicks || 0;
  return `${link.title}. Short URL: ${link.short_url || 'not set'}. ${clicks} total clicks. Status: ${link.status || 'active'}.`;
};

/**
 * Generate accessible ARIA label for form fields
 */
export const generateFieldAriaLabel = (label: string, required: boolean, hint?: string) => {
  const requiredText = required ? ', required field' : ', optional';
  const hintText = hint ? `. ${hint}` : '';
  return `${label}${requiredText}${hintText}`;
};

/**
 * Generate accessible ARIA label for status badges
 */
export const generateStatusAriaLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Status: Active. Link is currently accepting traffic.',
    paused: 'Status: Paused. Link is temporarily disabled.',
    archived: 'Status: Archived. Link is permanently disabled.',
    pending_approval: 'Status: Pending approval. Awaiting admin review.',
  };
  
  return statusMap[status] || `Status: ${status}`;
};

/**
 * Generate accessible ARIA label for dropdown menus
 */
export const generateDropdownAriaLabel = (itemName: string) => {
  return `Actions menu for ${itemName}. Press Enter to open menu, use arrow keys to navigate options.`;
};

/**
 * Generate accessible ARIA label for pagination
 */
export const generatePaginationAriaLabel = (currentPage: number, totalPages: number) => {
  return `Pagination navigation. Currently on page ${currentPage} of ${totalPages}. Use previous and next buttons to navigate.`;
};

/**
 * Get keyboard shortcut display text
 */
export const getKeyboardShortcut = (key: string, modKey: 'ctrl' | 'cmd' = 'cmd') => {
  const isMac = typeof window !== 'undefined' && navigator.platform.includes('Mac');
  const mod = isMac ? '⌘' : 'Ctrl';
  return `${mod}+${key}`;
};

/**
 * Announce to screen readers
 */
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};
