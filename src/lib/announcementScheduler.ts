import { AnnouncementConfig } from './announcementConfig';

export class AnnouncementScheduler {
  private static isWithinDateRange(announcement: AnnouncementConfig, now: Date): boolean {
    if (announcement.startDate && now < announcement.startDate) {
      return false;
    }
    if (announcement.endDate && now > announcement.endDate) {
      return false;
    }
    return true;
  }

  private static isWithinTimeRange(announcement: AnnouncementConfig, now: Date): boolean {
    if (!announcement.timeRange) {
      return true;
    }

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = announcement.timeRange.start.split(':').map(Number);
    const [endHour, endMin] = announcement.timeRange.end.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    return currentTime >= startTime && currentTime <= endTime;
  }

  private static isValidDayOfWeek(announcement: AnnouncementConfig, now: Date): boolean {
    if (!announcement.daysOfWeek || announcement.daysOfWeek.length === 0) {
      return true;
    }
    return announcement.daysOfWeek.includes(now.getDay());
  }

  private static matchesUserSegment(
    announcement: AnnouncementConfig,
    isAuthenticated: boolean,
    visitCount: number
  ): boolean {
    switch (announcement.userSegment) {
      case 'all':
        return true;
      case 'anonymous':
        return !isAuthenticated;
      case 'authenticated':
        return isAuthenticated;
      case 'new':
        return visitCount <= 2;
      case 'returning':
        return visitCount > 2;
      default:
        return true;
    }
  }

  private static getRotationIndex(
    rotationGroup: string,
    intervalMinutes: number,
    groupSize: number
  ): number {
    const now = Date.now();
    const intervalMs = intervalMinutes * 60 * 1000;
    const rotationKey = `rotation_${rotationGroup}`;
    
    // Check if we have a stored rotation start time
    const storedStart = localStorage.getItem(rotationKey);
    const startTime = storedStart ? parseInt(storedStart, 10) : now;
    
    if (!storedStart) {
      localStorage.setItem(rotationKey, startTime.toString());
    }

    // Calculate which item in rotation based on elapsed time
    const elapsed = now - startTime;
    const rotationIndex = Math.floor(elapsed / intervalMs) % groupSize;
    
    return rotationIndex;
  }

  public static selectAnnouncement(
    announcements: AnnouncementConfig[],
    isAuthenticated: boolean = false
  ): AnnouncementConfig | null {
    const now = new Date();
    
    // Get visit count from localStorage
    const visitCountStr = localStorage.getItem('visit_count');
    let visitCount = visitCountStr ? parseInt(visitCountStr, 10) : 1;
    
    // Increment and store visit count
    if (!visitCountStr) {
      localStorage.setItem('visit_count', '1');
    }

    // Filter announcements based on all criteria
    const eligibleAnnouncements = announcements.filter(announcement => {
      return (
        this.isWithinDateRange(announcement, now) &&
        this.isWithinTimeRange(announcement, now) &&
        this.isValidDayOfWeek(announcement, now) &&
        this.matchesUserSegment(announcement, isAuthenticated, visitCount)
      );
    });

    if (eligibleAnnouncements.length === 0) {
      return null;
    }

    // Sort by priority (highest first)
    eligibleAnnouncements.sort((a, b) => b.priority - a.priority);

    // Get the highest priority
    const highestPriority = eligibleAnnouncements[0].priority;

    // Get all announcements with the highest priority
    const topPriorityAnnouncements = eligibleAnnouncements.filter(
      a => a.priority === highestPriority
    );

    // If only one, return it
    if (topPriorityAnnouncements.length === 1) {
      return topPriorityAnnouncements[0];
    }

    // Handle rotation groups
    const rotationGroups = new Map<string, AnnouncementConfig[]>();
    const nonRotating: AnnouncementConfig[] = [];

    topPriorityAnnouncements.forEach(announcement => {
      if (announcement.rotationGroup) {
        const group = rotationGroups.get(announcement.rotationGroup) || [];
        group.push(announcement);
        rotationGroups.set(announcement.rotationGroup, group);
      } else {
        nonRotating.push(announcement);
      }
    });

    // If we have rotation groups, select from the first one
    if (rotationGroups.size > 0) {
      const firstGroup = Array.from(rotationGroups.values())[0];
      const intervalMinutes = firstGroup[0].rotationIntervalMinutes || 5;
      const rotationIndex = this.getRotationIndex(
        firstGroup[0].rotationGroup!,
        intervalMinutes,
        firstGroup.length
      );
      return firstGroup[rotationIndex];
    }

    // Otherwise, return the first non-rotating announcement
    return nonRotating[0] || topPriorityAnnouncements[0];
  }

  public static trackVisit(): void {
    const visitCountStr = localStorage.getItem('visit_count');
    const visitCount = visitCountStr ? parseInt(visitCountStr, 10) : 0;
    localStorage.setItem('visit_count', (visitCount + 1).toString());
  }
}
