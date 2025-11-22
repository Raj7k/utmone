# Announcement Bar Rotation System

## Overview

The announcement bar system intelligently displays different messages based on:
- **Time-based scheduling** (specific dates, days of week, time ranges)
- **User segmentation** (anonymous, authenticated, new, returning visitors)
- **Priority levels** (higher priority announcements shown first)
- **Rotation groups** (cycle through multiple messages at intervals)

## Configuration

Edit `src/lib/announcementConfig.ts` to add or modify announcements:

```typescript
{
  id: 'unique-id',
  message: '🎉 Your announcement message here',
  ctaText: 'Click here',
  ctaLink: '/destination',
  
  // Scheduling
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-07'),
  daysOfWeek: [0, 6], // 0=Sunday, 6=Saturday
  timeRange: {
    start: '09:00',
    end: '17:00',
  },
  
  // Targeting
  userSegment: 'all', // 'all' | 'anonymous' | 'authenticated' | 'new' | 'returning'
  priority: 20, // Higher = shown first
  
  // Rotation (optional)
  rotationGroup: 'group-name',
  rotationIntervalMinutes: 5,
}
```

## How It Works

### Priority System
1. System filters announcements based on current date/time and user segment
2. Announcements are sorted by priority (highest first)
3. If multiple announcements have the same priority, rotation groups are used
4. Each announcement can be individually dismissed by users

### User Segments
- **all**: Show to everyone
- **anonymous**: Only non-logged-in users
- **authenticated**: Only logged-in users
- **new**: First 2 visits
- **returning**: 3+ visits

### Rotation Groups
Messages in the same rotation group cycle automatically:
```typescript
{
  id: 'rotation-1',
  message: 'First message',
  rotationGroup: 'default',
  rotationIntervalMinutes: 5,
  priority: 5,
}
```

### Dismissal
Each announcement is dismissed individually using its unique ID. Users can see new announcements even if they dismissed previous ones.

## Examples

### Weekend-Only Announcement
```typescript
{
  id: 'weekend-promo',
  message: '🎉 Weekend special offer!',
  daysOfWeek: [0, 6], // Saturday and Sunday
  priority: 20,
}
```

### Business Hours Demo
```typescript
{
  id: 'demo-booking',
  message: '💼 Book a demo with our team',
  timeRange: { start: '09:00', end: '17:00' },
  daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
  priority: 15,
}
```

### Limited-Time Campaign
```typescript
{
  id: 'launch-week',
  message: '🚀 Launch week: Get early access now!',
  startDate: new Date('2025-02-01'),
  endDate: new Date('2025-02-07'),
  priority: 30,
}
```

### Message Rotation for Anonymous Users
```typescript
{
  id: 'rotation-1',
  message: '✨ Clean links, clear decisions',
  rotationGroup: 'anonymous-default',
  rotationIntervalMinutes: 5,
  userSegment: 'anonymous',
  priority: 5,
},
{
  id: 'rotation-2',
  message: '🎯 Perfect UTMs, every time',
  rotationGroup: 'anonymous-default',
  rotationIntervalMinutes: 5,
  userSegment: 'anonymous',
  priority: 5,
}
```

## Usage

### Basic Usage (Auto-Selection)
```tsx
<AnnouncementBar />
```

### With Authentication
```tsx
<AnnouncementBar isAuthenticated={!!user} />
```

### Custom Announcements
```tsx
const customAnnouncements: AnnouncementConfig[] = [
  {
    id: 'custom-1',
    message: 'Custom announcement',
    priority: 10,
  }
];

<AnnouncementBar customAnnouncements={customAnnouncements} />
```

## Testing

To test announcements:

1. **Clear localStorage**: `localStorage.clear()` in console
2. **Change system time**: Modify your computer's time to test time-based rules
3. **Test segments**: Clear visit count: `localStorage.removeItem('visit_count')`
4. **Test rotation**: Wait for `rotationIntervalMinutes` or clear rotation state: `localStorage.removeItem('rotation_groupname')`

## Architecture

- **`announcementConfig.ts`**: Configuration of all announcements
- **`announcementScheduler.ts`**: Logic for selecting the right announcement
- **`AnnouncementBar.tsx`**: UI component that displays the selected announcement
- **`Navigation.tsx`**: Dynamically adjusts position when announcement is visible
