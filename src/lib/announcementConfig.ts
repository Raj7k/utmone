export interface AnnouncementConfig {
  id: string;
  message: string;
  ctaText?: string;
  ctaLink?: string;
  
  // Scheduling
  startDate?: Date;
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6, Sunday-Saturday
  timeRange?: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
  
  // Targeting
  userSegment?: 'all' | 'anonymous' | 'authenticated' | 'new' | 'returning';
  priority: number; // Higher = shown first when multiple match
  
  // Rotation
  rotationGroup?: string; // Announcements in same group rotate
  rotationIntervalMinutes?: number; // How often to switch in rotation
}

export const announcements: AnnouncementConfig[] = [
  {
    id: 'coming-soon-main',
    message: 'coming soon — early access now open',
    ctaText: 'join the waitlist',
    ctaLink: '/early-access',
    priority: 10,
    userSegment: 'all',
  },
  {
    id: 'coming-soon-features',
    message: 'coming soon: Clean-Track attribution, AI intelligence, and branded QR codes',
    ctaText: 'get early access',
    ctaLink: '/early-access',
    priority: 8,
    rotationGroup: 'default',
    rotationIntervalMinutes: 10,
    userSegment: 'all',
  },
  {
    id: 'coming-soon-links',
    message: 'coming soon: smart links that track every click, conversion, and customer journey',
    ctaText: 'reserve your spot',
    ctaLink: '/early-access',
    priority: 8,
    rotationGroup: 'default',
    rotationIntervalMinutes: 10,
    userSegment: 'all',
  },
  {
    id: 'coming-soon-qr',
    message: 'coming soon: branded QR codes with real-time analytics',
    ctaText: 'learn more',
    ctaLink: '/early-access',
    priority: 8,
    rotationGroup: 'default',
    rotationIntervalMinutes: 10,
    userSegment: 'all',
  },
];
