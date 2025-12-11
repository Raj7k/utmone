export type ConnectionMethod = 'zapier' | 'api' | 'manual';

export interface EventPlatform {
  id: string;
  name: string;
  color: string;
  supportsWebhook: boolean;
  supportsApiPolling: boolean;
  connectionMethods: ConnectionMethod[];
  setupDocsUrl: string;
  apiKeyName?: string;
  description: string;
}

export const EVENT_PLATFORMS: Record<string, EventPlatform> = {
  luma: {
    id: 'luma',
    name: 'Luma',
    color: '#9333EA',
    supportsWebhook: false,
    supportsApiPolling: true,
    connectionMethods: ['zapier', 'api', 'manual'],
    setupDocsUrl: 'https://lu.ma/developers',
    apiKeyName: 'LUMA_API_KEY',
    description: 'modern event hosting platform',
  },
  airmeet: {
    id: 'airmeet',
    name: 'Airmeet',
    color: '#2563EB',
    supportsWebhook: true,
    supportsApiPolling: true,
    connectionMethods: ['api', 'zapier'],
    setupDocsUrl: 'https://help.airmeet.com/support/solutions/articles/82000880991-airmeet-api',
    apiKeyName: 'AIRMEET_API_KEY',
    description: 'virtual & hybrid events platform',
  },
  goldcast: {
    id: 'goldcast',
    name: 'Goldcast',
    color: '#F59E0B',
    supportsWebhook: true,
    supportsApiPolling: true,
    connectionMethods: ['api', 'zapier'],
    setupDocsUrl: 'https://help.goldcast.io/hc/en-us/articles/4407290587409',
    apiKeyName: 'GOLDCAST_API_KEY',
    description: 'B2B event marketing platform',
  },
  eventbrite: {
    id: 'eventbrite',
    name: 'Eventbrite',
    color: '#F05537',
    supportsWebhook: true,
    supportsApiPolling: true,
    connectionMethods: ['api', 'zapier'],
    setupDocsUrl: 'https://www.eventbrite.com/platform/api',
    apiKeyName: 'EVENTBRITE_API_KEY',
    description: 'ticketing & event registration',
  },
  generic: {
    id: 'generic',
    name: 'Generic Webhook',
    color: '#6B7280',
    supportsWebhook: true,
    supportsApiPolling: false,
    connectionMethods: ['manual'],
    setupDocsUrl: '',
    description: 'custom webhook integration',
  },
};

export const getEventPlatform = (id: string): EventPlatform => {
  return EVENT_PLATFORMS[id] || EVENT_PLATFORMS.generic;
};

export const getConnectionMethodLabel = (method: ConnectionMethod): string => {
  const labels: Record<ConnectionMethod, string> = {
    zapier: 'Zapier Bridge',
    api: 'API Polling',
    manual: 'Manual Import',
  };
  return labels[method];
};

export const getConnectionMethodDescription = (platformId: string, method: ConnectionMethod): string => {
  const platform = getEventPlatform(platformId);
  
  const descriptions: Record<ConnectionMethod, string> = {
    zapier: `use Zapier to connect ${platform.name} events to this webhook. setup guide shown after creation.`,
    api: `connect directly via ${platform.name} API. we'll poll for new registrations every 5 minutes.`,
    manual: `export attendees from ${platform.name} as CSV and import them here. best for one-time imports.`,
  };
  
  return descriptions[method];
};
