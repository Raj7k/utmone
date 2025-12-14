import { supabase } from "@/integrations/supabase/client";

// Helper to get cached user ID without calling getUser()
const getCachedUserId = (): string | null => {
  try {
    const cached = localStorage.getItem('utm_session_cache');
    return cached ? JSON.parse(cached)?.user?.id : null;
  } catch {
    return null;
  }
};

export const useAnnouncementTracking = () => {
  const getSessionId = () => {
    let sessionId = localStorage.getItem('announcement_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('announcement_session_id', sessionId);
    }
    return sessionId;
  };

  const trackImpression = async (announcementId: string, userSegment: string) => {
    // DEFER: Don't block page render with tracking
    setTimeout(async () => {
      try {
        const sessionId = getSessionId();
        const userId = getCachedUserId();
        
        await supabase.functions.invoke('track-announcement-event', {
          body: {
            eventType: 'impression',
            announcementId,
            sessionId,
            userId,
            metadata: {
              userSegment,
              referrer: document.referrer,
              userAgent: navigator.userAgent,
            },
          },
        });
      } catch (error) {
        console.error('Failed to track impression:', error);
      }
    }, 100); // Small delay to let critical path complete
  };

  const trackClick = async (announcementId: string, ctaLink: string) => {
    // Clicks are user-initiated, so we can track synchronously
    try {
      const sessionId = getSessionId();
      const userId = getCachedUserId();
      
      await supabase.functions.invoke('track-announcement-event', {
        body: {
          eventType: 'click',
          announcementId,
          sessionId,
          userId,
          metadata: {
            ctaLink,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
          },
        },
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  const trackDismissal = async (announcementId: string) => {
    // Dismissals are user-initiated, so we can track synchronously
    try {
      const sessionId = getSessionId();
      const userId = getCachedUserId();
      
      await supabase.functions.invoke('track-announcement-event', {
        body: {
          eventType: 'dismissal',
          announcementId,
          sessionId,
          userId,
        },
      });
    } catch (error) {
      console.error('Failed to track dismissal:', error);
    }
  };

  return { trackImpression, trackClick, trackDismissal };
};
