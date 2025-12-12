import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSessionData } from '@/lib/sessionManager';

const PROJECT_URL = import.meta.env.VITE_SUPABASE_URL;

const sendAnalyticsEvent = (
  eventType: 'page_view' | 'cta_click' | 'scroll_depth' | 'time_on_page',
  eventData?: Record<string, any>
) => {
  // Defer analytics to avoid blocking render
  const doSend = async () => {
    const sessionData = getSessionData();
    if (!sessionData) return;

    try {
      await supabase.functions.invoke('landing-analytics', {
        body: {
          session_id: sessionData.sessionId,
          event_type: eventType,
          event_data: eventData || {},
          hero_variant: sessionData.variant,
          user_agent: navigator.userAgent,
          referrer: document.referrer,
        },
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  // Use requestIdleCallback to defer analytics, avoiding render blocking
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => doSend(), { timeout: 2000 });
  } else {
    setTimeout(doSend, 100);
  }
};

export const useTrackPageView = () => {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      sendAnalyticsEvent('page_view');
      hasTracked.current = true;
    }
  }, []);
};

export const useTrackCTAClick = () => {
  return useCallback((ctaLocation: string) => {
    sendAnalyticsEvent('cta_click', { location: ctaLocation });
  }, []);
};

export const useTrackScrollDepth = () => {
  useEffect(() => {
    const trackedDepths = new Set<number>();
    
    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      [25, 50, 75, 100].forEach(threshold => {
        if (scrollPercentage >= threshold && !trackedDepths.has(threshold)) {
          trackedDepths.add(threshold);
          sendAnalyticsEvent('scroll_depth', { depth: threshold });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

export const useTrackTimeOnPage = () => {
  useEffect(() => {
    const intervals = [30, 60, 120, 300]; // 30s, 1min, 2min, 5min
    const timers: NodeJS.Timeout[] = [];

    intervals.forEach(seconds => {
      const timer = setTimeout(() => {
        sendAnalyticsEvent('time_on_page', { seconds });
      }, seconds * 1000);
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);
};
