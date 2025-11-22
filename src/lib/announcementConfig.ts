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
    id: 'early-access-general',
    message: '🎉 Early access now open! Limited spots available for design partners.',
    ctaText: 'Join the waitlist',
    ctaLink: '/early-access',
    priority: 10,
    userSegment: 'all',
  },
  {
    id: 'weekend-special',
    message: '🚀 Weekend launch special: Get priority access when you join this weekend!',
    ctaText: 'Claim your spot',
    ctaLink: '/early-access',
    daysOfWeek: [0, 6], // Sunday, Saturday
    priority: 20,
    userSegment: 'anonymous',
  },
  {
    id: 'business-hours-demo',
    message: '💼 Book a personalized demo with our team during business hours.',
    ctaText: 'Schedule demo',
    ctaLink: '/early-access',
    timeRange: {
      start: '09:00',
      end: '17:00',
    },
    daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday
    priority: 15,
    userSegment: 'returning',
  },
  {
    id: 'product-hunt-launch',
    message: '🏆 We\'re live on Product Hunt! Support us and get early access.',
    ctaText: 'View on Product Hunt',
    ctaLink: '/early-access',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-07'),
    priority: 30,
    userSegment: 'all',
  },
  {
    id: 'rotation-1',
    message: '✨ Clean links, clear decisions. Join the early circle.',
    ctaText: 'Get started',
    ctaLink: '/early-access',
    priority: 5,
    rotationGroup: 'default',
    rotationIntervalMinutes: 5,
    userSegment: 'all',
  },
  {
    id: 'rotation-2',
    message: '🎯 Perfect UTMs, every time. See how utm.one works.',
    ctaText: 'Learn more',
    ctaLink: '/early-access',
    priority: 5,
    rotationGroup: 'default',
    rotationIntervalMinutes: 5,
    userSegment: 'all',
  },
  {
    id: 'rotation-3',
    message: '🔗 Branded short links + QR codes + analytics in one place.',
    ctaText: 'Explore features',
    ctaLink: '/early-access',
    priority: 5,
    rotationGroup: 'default',
    rotationIntervalMinutes: 5,
    userSegment: 'all',
  },
];
