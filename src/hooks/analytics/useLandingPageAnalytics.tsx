import { useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { supabaseFrom } from '@/lib/supabaseHelper';
import { getSessionData } from '@/lib/sessionManager';
import { subDays } from 'date-fns';

const PROJECT_URL = import.meta.env.VITE_SUPABASE_URL;

// Type for landing analytics metrics
export interface VariantMetrics {
  variant_id: number;
  sessions: number;
  cta_clicks: number;
  ctr: number;
  avg_time_on_page: number;
  avg_scroll_depth: number;
}

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

// Analytics hook for admin pages
export const useLandingAnalytics = (dateRangeDays: number = 30) => {
  return useQuery({
    queryKey: ['landing-analytics', dateRangeDays],
    queryFn: async () => {
      const startDate = subDays(new Date(), dateRangeDays).toISOString();

      // Get sessions per variant
      const { data: sessionsData, error: sessionsError } = await supabaseFrom('landing_page_sessions')
        .select('hero_variant')
        .gte('created_at', startDate);

      if (sessionsError) throw sessionsError;

      // Get events per variant
      const { data: eventsData, error: eventsError } = await supabaseFrom('landing_page_events')
        .select('*')
        .gte('created_at', startDate);

      if (eventsError) throw eventsError;

      // Aggregate metrics by variant
      const metrics: VariantMetrics[] = [0, 1, 2, 3].map(variantId => {
        const variantSessions = sessionsData?.filter(s => s.hero_variant === variantId).length || 0;
        const variantEvents = eventsData?.filter(e => e.hero_variant === variantId) || [];

        const ctaClicks = variantEvents.filter(e => e.event_type === 'cta_click').length;
        const timeEvents = variantEvents.filter(e => e.event_type === 'time_on_page');
        const scrollEvents = variantEvents.filter(e => e.event_type === 'scroll_depth');

        const avgTimeOnPage = timeEvents.length > 0
          ? timeEvents.reduce((sum, e) => {
              const data = e.event_data as { seconds?: number } | null;
              return sum + (data?.seconds || 0);
            }, 0) / timeEvents.length
          : 0;

        const avgScrollDepth = scrollEvents.length > 0
          ? scrollEvents.reduce((sum, e) => {
              const data = e.event_data as { depth?: number } | null;
              return sum + (data?.depth || 0);
            }, 0) / scrollEvents.length
          : 0;

        const ctr = variantSessions > 0 ? (ctaClicks / variantSessions) * 100 : 0;

        return {
          variant_id: variantId,
          sessions: variantSessions,
          cta_clicks: ctaClicks,
          ctr: Math.round(ctr * 100) / 100,
          avg_time_on_page: Math.round(avgTimeOnPage),
          avg_scroll_depth: Math.round(avgScrollDepth),
        };
      });

      return metrics;
    },
  });
};
