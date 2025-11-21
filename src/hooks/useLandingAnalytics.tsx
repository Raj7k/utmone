import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { subDays } from 'date-fns';

export interface VariantMetrics {
  variant_id: number;
  sessions: number;
  cta_clicks: number;
  ctr: number;
  avg_time_on_page: number;
  avg_scroll_depth: number;
}

export const useLandingAnalytics = (dateRangeDays: number = 30) => {
  return useQuery({
    queryKey: ['landing-analytics', dateRangeDays],
    queryFn: async () => {
      const startDate = subDays(new Date(), dateRangeDays).toISOString();

      // Get sessions per variant
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('landing_page_sessions')
        .select('hero_variant')
        .gte('created_at', startDate);

      if (sessionsError) throw sessionsError;

      // Get events per variant
      const { data: eventsData, error: eventsError } = await supabase
        .from('landing_page_events')
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
