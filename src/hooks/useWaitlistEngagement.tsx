import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'waitlist_session_id';
const REFERRAL_KEY = 'waitlist_referral_code';

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `wl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Get referral code from URL if present
const getReferralCode = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  const refCode = params.get('ref');
  
  if (refCode) {
    localStorage.setItem(REFERRAL_KEY, refCode);
    return refCode;
  }
  
  return localStorage.getItem(REFERRAL_KEY);
};

interface TrackEventParams {
  eventType: 'page_view' | 'form_start' | 'form_submit' | 'scroll_depth' | 'time_on_page' | 'click';
  eventData?: Record<string, any>;
  pagePath?: string;
}

const sendEvent = async ({ eventType, eventData, pagePath }: TrackEventParams) => {
  const sessionId = getSessionId();
  const referralCode = getReferralCode();
  
  try {
    await supabase.functions.invoke('track-waitlist-engagement', {
      body: {
        session_id: sessionId,
        event_type: eventType,
        event_data: eventData || {},
        page_path: pagePath || window.location.pathname,
        referrer: document.referrer || null,
        referral_code: referralCode,
        user_agent: navigator.userAgent,
      },
    });
  } catch (error) {
    // Silently fail - don't block user experience
    console.debug('Engagement tracking error:', error);
  }
};

export const useTrackPageView = (pagePath?: string) => {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      sendEvent({ 
        eventType: 'page_view',
        pagePath: pagePath || window.location.pathname,
      });
    }
  }, [pagePath]);
};

export const useTrackFormStart = () => {
  const trackFormStart = useCallback(() => {
    sendEvent({ eventType: 'form_start' });
  }, []);

  return trackFormStart;
};

export const useTrackFormSubmit = () => {
  const trackFormSubmit = useCallback((formData?: Record<string, any>) => {
    sendEvent({ 
      eventType: 'form_submit',
      eventData: formData,
    });
  }, []);

  return trackFormSubmit;
};

export const useTrackScrollDepth = () => {
  useEffect(() => {
    const depths = [25, 50, 75, 100];
    const tracked = new Set<number>();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      depths.forEach((depth) => {
        if (scrollPercent >= depth && !tracked.has(depth)) {
          tracked.add(depth);
          sendEvent({
            eventType: 'scroll_depth',
            eventData: { depth },
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

export const useTrackTimeOnPage = () => {
  useEffect(() => {
    const intervals = [30, 60, 120, 300]; // seconds
    const timers: NodeJS.Timeout[] = [];

    intervals.forEach((seconds) => {
      const timer = setTimeout(() => {
        sendEvent({
          eventType: 'time_on_page',
          eventData: { seconds },
        });
      }, seconds * 1000);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);
};

export const useTrackClick = () => {
  const trackClick = useCallback((element: string, data?: Record<string, any>) => {
    sendEvent({
      eventType: 'click',
      eventData: { element, ...data },
    });
  }, []);

  return trackClick;
};

// Get referral code for sharing
export const useReferralCode = () => {
  return getReferralCode();
};
