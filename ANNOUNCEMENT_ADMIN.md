# Announcement Admin Dashboard

## Overview

The announcement admin dashboard provides a comprehensive interface for managing announcement bar configurations, previewing scheduling rules, and analyzing performance metrics.

## Access

**Route**: `/admin/announcements`

**Permission**: Requires `admin` role in `user_roles` table

## Features

### 1. Announcement Management

**List View** - View all announcements with:
- Active/Inactive status toggle
- Priority level
- Message preview
- Scheduling summary (dates, days, time ranges)
- User segment targeting
- Quick actions (Edit, Delete, View Analytics)

**Create/Edit** - Configure announcements with:
- Message text and CTA
- Date range scheduling
- Time-based scheduling (HH:MM format)
- Day-of-week targeting
- User segment selection
- Priority level
- Rotation groups

### 2. Performance Analytics

Track announcement effectiveness with:

**Metrics**:
- **Impressions**: Total times announcement was shown
- **Clicks**: Total CTA clicks
- **Click-Through Rate (CTR)**: Clicks / Impressions × 100
- **Dismissals**: Times users dismissed announcement
- **Dismissal Rate**: Dismissals / Impressions × 100

**Performance Insights**:
- Engagement rate (combined clicks + dismissals)
- Conversion quality badges (excellent: >5%, good: 2-5%, needs improvement: <2%)
- 30-day historical data

**Color Indicators**:
- Green TrendingUp icon: CTR > 5%
- Red TrendingDown icon: CTR ≤ 5%

### 3. Preview Mode

See how announcements appear under different conditions:
- Visual preview with gradient background
- Targeting rules display
- Real-time match status ("would display now")

## Database Schema

### Tables Created

**announcement_configs** - Stores announcement configurations:
```sql
id, config_id, message, cta_text, cta_link,
start_date, end_date, days_of_week, 
time_range_start, time_range_end,
user_segment, priority,
rotation_group, rotation_interval_minutes,
is_active, created_by, created_at, updated_at
```

**announcement_impressions** - Tracks displays:
```sql
id, announcement_id, session_id, user_id,
user_segment, referrer, user_agent, created_at
```

**announcement_clicks** - Tracks CTA clicks:
```sql
id, announcement_id, session_id, user_id,
cta_link, referrer, user_agent, created_at
```

**announcement_dismissals** - Tracks dismissals:
```sql
id, announcement_id, session_id, user_id, created_at
```

## Analytics Tracking

### Automatic Tracking

The `AnnouncementBar` component automatically tracks:
1. **Impression** - When announcement is shown
2. **Click** - When CTA link is clicked
3. **Dismissal** - When user dismisses announcement

### Implementation

Uses edge function `track-announcement-event` that:
- Accepts event type (impression, click, dismissal)
- Stores anonymous or authenticated user data
- Captures session context (user agent, referrer)
- Uses service role key to bypass RLS

### Session Management

Sessions tracked via `localStorage`:
- `announcement_session_id`: Unique session identifier
- Format: `session_{timestamp}_{random}`
- Persists across page reloads

## Usage Examples

### View All Announcements
```typescript
const { announcements, isLoading } = useAnnouncementAdmin();
```

### Fetch Analytics
```typescript
const { fetchAnnouncementAnalytics } = useAnnouncementAdmin();
const analytics = await fetchAnnouncementAnalytics('announcement-id', 30); // last 30 days
```

### Create Announcement
```typescript
const { createAnnouncement } = useAnnouncementAdmin();
createAnnouncement({
  id: 'new-promo',
  message: '🎉 Special offer!',
  ctaText: 'Learn more',
  ctaLink: '/pricing',
  priority: 20,
  userSegment: 'anonymous',
  startDate: new Date('2025-02-01'),
  endDate: new Date('2025-02-28'),
});
```

### Toggle Active Status
```typescript
const { toggleActive } = useAnnouncementAdmin();
toggleActive({ id: 'uuid', isActive: false });
```

### Delete Announcement
```typescript
const { deleteAnnouncement } = useAnnouncementAdmin();
deleteAnnouncement('uuid');
```

## Best Practices

### Priority Guidelines
- **30+**: Critical announcements (launch events, Product Hunt)
- **20-29**: High priority (weekend specials, limited-time offers)
- **10-19**: Standard priority (general updates, feature releases)
- **5-9**: Low priority (evergreen content, rotation messages)
- **0-4**: Lowest priority (fallback messages)

### CTR Benchmarks
- **Excellent**: >5% - High engagement, compelling message
- **Good**: 2-5% - Acceptable performance
- **Needs Improvement**: <2% - Review message, targeting, or CTA

### Dismissal Rate Interpretation
- **<10%**: Very engaging, users want to see it
- **10-20%**: Acceptable, most users engage or ignore
- **20-30%**: High dismissal, consider message fatigue
- **>30%**: Very high dismissal, review relevance and frequency

### Optimization Tips
1. **Test CTAs**: Try different action verbs ("Join", "Claim", "Get", "See")
2. **Timing**: Match announcements to user behavior (business hours for B2B)
3. **Segmentation**: Target specific user groups for better relevance
4. **Rotation**: Use rotation groups to prevent message fatigue
5. **Analysis**: Review analytics weekly to identify winning patterns

## Security

- All tables protected with RLS requiring `admin` role
- Edge function uses service role key for write operations
- Anonymous tracking supported for public users
- Sensitive user data not logged in analytics

## Future Enhancements

Potential additions:
- Visual editor with live preview
- A/B testing framework for message variants
- Email alerts for performance thresholds
- CSV export of analytics data
- Geographic targeting rules
- Device-type targeting (mobile vs desktop)
- Multi-language support
- Scheduled activation/deactivation
