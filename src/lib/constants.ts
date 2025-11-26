/**
 * Application Constants
 * Centralized configuration values for enterprise-grade settings
 */

// Pagination
export const PAGINATION_LIMIT = 20;
export const INITIAL_PAGE = 1;

// URL Validation
export const MAX_URL_LENGTH = 2048;
export const MIN_SLUG_LENGTH = 3;
export const MAX_SLUG_LENGTH = 50;
export const SLUG_PATTERN = /^[a-z0-9-]+$/;

// Domains
export const DEFAULT_DOMAIN = 'utm.click';
export const SYSTEM_DOMAINS = ['utm.click', 'go.utm.one'];

// Rate Limiting
export const PUBLIC_LINK_RATE_LIMIT = 10; // per hour
export const RATE_LIMIT_WINDOW_HOURS = 1;

// URL Versioning
export const MAX_URL_VERSIONS = 10;
export const VERSION_ARCHIVE_DAYS = 90;
export const AUTO_ARCHIVE_THRESHOLD_CLICKS = 100;

// Duplicate Detection
export const DUPLICATE_STRATEGIES = {
  SMART: 'smart',
  ASK: 'ask',
  ALWAYS_NEW: 'always-new',
  USE_EXISTING: 'use-existing',
} as const;

export const PERFORMANCE_CTR_THRESHOLD = 3; // Minimum CTR% for "best performing"

// QR Code
export const QR_DEFAULT_SIZE = 256;
export const QR_MAX_SIZE = 2048;

// Analytics
export const ANALYTICS_RETENTION_DAYS = 365;
export const TOP_ITEMS_LIMIT = 10;

// Export Formats
export const EXPORT_FORMATS = ['txt', 'csv', 'json'] as const;

// Link Status
export const LINK_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  EXPIRED: 'expired',
  ARCHIVED: 'archived',
  SCHEDULED: 'scheduled',
} as const;

// Campaign Defaults
export const DEFAULT_CAMPAIGN_NAME = 'Direct';

// Timeouts
export const DEBOUNCE_DELAY_MS = 500;
export const PROCESSING_DELAY_MS = 1500;
export const NOTIFICATION_TIMEOUT_MS = 5000;
