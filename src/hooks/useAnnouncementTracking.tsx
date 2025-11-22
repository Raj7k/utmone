import { supabase } from "@/integrations/supabase/client";

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
    try {
      const sessionId = getSessionId();
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.functions.invoke('track-announcement-event', {
        body: {
          eventType: 'impression',
          announcementId,
          sessionId,
          userId: user?.id,
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
  };

  const trackClick = async (announcementId: string, ctaLink: string) => {
    try {
      const sessionId = getSessionId();
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.functions.invoke('track-announcement-event', {
        body: {
          eventType: 'click',
          announcementId,
          sessionId,
          userId: user?.id,
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
    try {
      const sessionId = getSessionId();
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.functions.invoke('track-announcement-event', {
        body: {
          eventType: 'dismissal',
          announcementId,
          sessionId,
          userId: user?.id,
        },
      });
    } catch (error) {
      console.error('Failed to track dismissal:', error);
    }
  };

  return { trackImpression, trackClick, trackDismissal };
};
