import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SmartInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'anomaly' | 'optimization' | 'trend';
  category: 'revenue' | 'traffic' | 'campaign' | 'channel' | 'conversion' | 'timing';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impactScore: number;
  actionLabel: string;
  actionUrl: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { workspaceId, linkId, scope = 'workspace', timeRange = 'auto' } = await req.json();

    if (!workspaceId) {
      return new Response(JSON.stringify({ error: 'workspaceId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const insights: SmartInsight[] = [];
    const now = new Date();

    // Determine analysis window based on timeRange
    let analysisDays = 7;
    if (timeRange === '14d') analysisDays = 14;
    else if (timeRange === '30d') analysisDays = 30;
    else if (timeRange === '90d') analysisDays = 90;
    else if (timeRange === 'all') analysisDays = 365 * 5; // 5 years as "all"

    const analysisStartDate = new Date(now.getTime() - analysisDays * 24 * 60 * 60 * 1000);
    const comparisonPeriodStart = new Date(analysisStartDate.getTime() - analysisDays * 24 * 60 * 60 * 1000);

    // Fetch clicks for analysis period
    let clicksQuery = supabase
      .from('link_clicks')
      .select('*, links!inner(workspace_id, short_code, utm_source, utm_medium, utm_campaign)')
      .eq('links.workspace_id', workspaceId)
      .gte('clicked_at', analysisStartDate.toISOString());

    if (scope === 'link' && linkId) {
      clicksQuery = clicksQuery.eq('link_id', linkId);
    }

    let { data: recentClicks } = await clicksQuery;
    let currentClickCount = recentClicks?.length || 0;

    // Auto-expand to 30 days if not enough data in 7 days
    if (timeRange === 'auto' && currentClickCount < 10) {
      console.log(`Only ${currentClickCount} clicks in 7 days, expanding to 30 days`);
      analysisDays = 30;
      const expandedStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      let expandedQuery = supabase
        .from('link_clicks')
        .select('*, links!inner(workspace_id, short_code, utm_source, utm_medium, utm_campaign)')
        .eq('links.workspace_id', workspaceId)
        .gte('clicked_at', expandedStartDate.toISOString());

      if (scope === 'link' && linkId) {
        expandedQuery = expandedQuery.eq('link_id', linkId);
      }

      const expandedResult = await expandedQuery;
      if ((expandedResult.data?.length || 0) > currentClickCount) {
        recentClicks = expandedResult.data;
        currentClickCount = recentClicks?.length || 0;
        console.log(`Expanded to ${currentClickCount} clicks in 30 days`);
      }

      // If still not enough, try 90 days
      if (currentClickCount < 10) {
        console.log(`Only ${currentClickCount} clicks in 30 days, expanding to 90 days`);
        analysisDays = 90;
        const expanded90Date = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        
        let expanded90Query = supabase
          .from('link_clicks')
          .select('*, links!inner(workspace_id, short_code, utm_source, utm_medium, utm_campaign)')
          .eq('links.workspace_id', workspaceId)
          .gte('clicked_at', expanded90Date.toISOString());

        if (scope === 'link' && linkId) {
          expanded90Query = expanded90Query.eq('link_id', linkId);
        }

        const expanded90Result = await expanded90Query;
        if ((expanded90Result.data?.length || 0) > currentClickCount) {
          recentClicks = expanded90Result.data;
          currentClickCount = recentClicks?.length || 0;
          console.log(`Expanded to ${currentClickCount} clicks in 90 days`);
        }
      }
    }

    // Fetch total all-time clicks for context
    let totalClicksQuery = supabase
      .from('link_clicks')
      .select('id', { count: 'exact' })
      .eq('workspace_id', workspaceId);

    if (scope === 'link' && linkId) {
      totalClicksQuery = totalClicksQuery.eq('link_id', linkId);
    }

    const { count: totalAllTimeClicks } = await totalClicksQuery;

    // Fetch previous period clicks for comparison
    const prevPeriodEnd = new Date(now.getTime() - analysisDays * 24 * 60 * 60 * 1000);
    const prevPeriodStart = new Date(prevPeriodEnd.getTime() - analysisDays * 24 * 60 * 60 * 1000);

    let prevClicksQuery = supabase
      .from('link_clicks')
      .select('*, links!inner(workspace_id)')
      .eq('links.workspace_id', workspaceId)
      .gte('clicked_at', prevPeriodStart.toISOString())
      .lt('clicked_at', prevPeriodEnd.toISOString());

    if (scope === 'link' && linkId) {
      prevClicksQuery = prevClicksQuery.eq('link_id', linkId);
    }

    const { data: prevClicks } = await prevClicksQuery;
    const prevClickCount = prevClicks?.length || 0;

    // Create period label for messaging
    const periodLabel = analysisDays <= 7 ? 'this week' : 
                        analysisDays <= 14 ? 'last 2 weeks' :
                        analysisDays <= 30 ? 'last 30 days' :
                        analysisDays <= 90 ? 'last 90 days' : 'all time';

    // 1. Traffic trend analysis
    if (currentClickCount > 0 && prevClickCount > 0) {
      const changePercent = ((currentClickCount - prevClickCount) / prevClickCount) * 100;
      
      if (changePercent > 50) {
        insights.push({
          id: `traffic-spike-${Date.now()}`,
          type: 'opportunity',
          category: 'traffic',
          severity: 'high',
          title: 'Traffic surge detected',
          description: `Your traffic increased by ${changePercent.toFixed(0)}% in ${periodLabel}. Consider amplifying what's working.`,
          impactScore: Math.min(100, Math.abs(changePercent)),
          actionLabel: 'View traffic sources',
          actionUrl: `/dashboard/analytics?tab=channels`,
          metadata: { changePercent, currentClickCount, prevClickCount, analysisDays }
        });
      } else if (changePercent < -30) {
        insights.push({
          id: `traffic-drop-${Date.now()}`,
          type: 'warning',
          category: 'traffic',
          severity: changePercent < -50 ? 'critical' : 'high',
          title: 'Traffic declining',
          description: `Traffic dropped by ${Math.abs(changePercent).toFixed(0)}% in ${periodLabel}. Review your active campaigns.`,
          impactScore: Math.min(100, Math.abs(changePercent)),
          actionLabel: 'Check campaigns',
          actionUrl: `/dashboard/campaigns`,
          metadata: { changePercent, currentClickCount, prevClickCount, analysisDays }
        });
      }
    }

    // 2. Channel performance analysis
    if (recentClicks && recentClicks.length > 0) {
      const channelCounts: Record<string, number> = {};
      recentClicks.forEach(click => {
        const source = click.links?.utm_source || click.referrer || 'Direct';
        channelCounts[source] = (channelCounts[source] || 0) + 1;
      });

      const sortedChannels = Object.entries(channelCounts).sort(([, a], [, b]) => b - a);
      const topChannel = sortedChannels[0];

      if (topChannel && topChannel[1] > currentClickCount * 0.4) {
        insights.push({
          id: `top-channel-${Date.now()}`,
          type: 'opportunity',
          category: 'channel',
          severity: 'medium',
          title: `${topChannel[0]} is your powerhouse`,
          description: `${topChannel[0]} drives ${((topChannel[1] / currentClickCount) * 100).toFixed(0)}% of your traffic. Double down on this channel.`,
          impactScore: Math.round((topChannel[1] / currentClickCount) * 100),
          actionLabel: 'Optimize channel',
          actionUrl: `/dashboard/analytics?channel=${encodeURIComponent(topChannel[0])}`,
          metadata: { channel: topChannel[0], clicks: topChannel[1], percentage: (topChannel[1] / currentClickCount) * 100 }
        });
      }

      // Identify underperforming channels
      if (sortedChannels.length > 2) {
        const bottomChannel = sortedChannels[sortedChannels.length - 1];
        if (bottomChannel[1] < currentClickCount * 0.05) {
          insights.push({
            id: `weak-channel-${Date.now()}`,
            type: 'optimization',
            category: 'channel',
            severity: 'low',
            title: `${bottomChannel[0]} needs attention`,
            description: `${bottomChannel[0]} contributes only ${((bottomChannel[1] / currentClickCount) * 100).toFixed(1)}% of clicks. Consider optimizing or reallocating budget.`,
            impactScore: 25,
            actionLabel: 'Review strategy',
            actionUrl: `/dashboard/analytics?channel=${encodeURIComponent(bottomChannel[0])}`,
            metadata: { channel: bottomChannel[0], clicks: bottomChannel[1] }
          });
        }
      }
    }

    // 3. Best timing analysis
    if (recentClicks && recentClicks.length >= 10) {
      const hourCounts: Record<number, number> = {};
      const dayCounts: Record<number, number> = {};

      recentClicks.forEach(click => {
        const clickDate = new Date(click.clicked_at);
        const hour = clickDate.getUTCHours();
        const day = clickDate.getUTCDay();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      });

      const peakHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0];
      const peakDay = Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0];
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      insights.push({
        id: `timing-insight-${Date.now()}`,
        type: 'optimization',
        category: 'timing',
        severity: 'medium',
        title: 'Best time to post',
        description: `Your audience is most active on ${dayNames[parseInt(peakDay[0])]}s around ${peakHour[0]}:00 UTC. Schedule campaigns accordingly.`,
        impactScore: 60,
        actionLabel: 'View timing data',
        actionUrl: `/dashboard/analytics?tab=timing`,
        metadata: { peakHour: parseInt(peakHour[0]), peakDay: parseInt(peakDay[0]), dayName: dayNames[parseInt(peakDay[0])] }
      });
    }

    // 4. Geographic opportunity
    if (recentClicks && recentClicks.length >= 20) {
      const countryCounts: Record<string, number> = {};
      recentClicks.forEach(click => {
        if (click.country) {
          countryCounts[click.country] = (countryCounts[click.country] || 0) + 1;
        }
      });

      const topCountries = Object.entries(countryCounts).sort(([, a], [, b]) => b - a).slice(0, 3);
      
      if (topCountries.length > 0) {
        const topCountry = topCountries[0];
        const percentage = ((topCountry[1] / currentClickCount) * 100).toFixed(0);

        insights.push({
          id: `geo-insight-${Date.now()}`,
          type: 'opportunity',
          category: 'traffic',
          severity: 'medium',
          title: `Strong presence in ${topCountry[0]}`,
          description: `${percentage}% of your traffic comes from ${topCountry[0]}. Consider localized campaigns for this market.`,
          impactScore: parseInt(percentage),
          actionLabel: 'Set up geo-targeting',
          actionUrl: `/dashboard/targeting`,
          metadata: { country: topCountry[0], clicks: topCountry[1], percentage }
        });
      }
    }

    // 5. Device optimization
    if (recentClicks && recentClicks.length >= 20) {
      const deviceCounts: Record<string, number> = {};
      recentClicks.forEach(click => {
        const device = click.device_type || 'Unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });

      const mobileCount = (deviceCounts['Mobile'] || 0) + (deviceCounts['mobile'] || 0);
      const mobilePercent = (mobileCount / currentClickCount) * 100;

      if (mobilePercent > 70) {
        insights.push({
          id: `mobile-insight-${Date.now()}`,
          type: 'optimization',
          category: 'traffic',
          severity: 'medium',
          title: 'Mobile-first audience',
          description: `${mobilePercent.toFixed(0)}% of your clicks come from mobile devices. Ensure your landing pages are mobile-optimized.`,
          impactScore: Math.round(mobilePercent),
          actionLabel: 'Review landing pages',
          actionUrl: `/dashboard/links`,
          metadata: { mobilePercent, mobileCount }
        });
      }
    }

    // 6. Fetch campaigns for campaign-level insights
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, name, status')
      .eq('workspace_id', workspaceId)
      .eq('status', 'active');

    if (campaigns && campaigns.length > 0) {
      // Check for campaigns with no recent activity
      for (const campaign of campaigns.slice(0, 3)) {
        const { data: campaignLinks } = await supabase
          .from('links')
          .select('id')
          .eq('campaign_id', campaign.id);

        if (campaignLinks && campaignLinks.length > 0) {
          const linkIds = campaignLinks.map(l => l.id);
          const campaignClicks = recentClicks?.filter(c => linkIds.includes(c.link_id)) || [];

          if (campaignClicks.length === 0) {
            insights.push({
              id: `campaign-inactive-${campaign.id}`,
              type: 'warning',
              category: 'campaign',
              severity: 'high',
              title: `${campaign.name} has no recent activity`,
              description: `This active campaign had zero clicks in ${periodLabel}. Review if it needs promotion or should be paused.`,
              impactScore: 70,
              actionLabel: 'View campaign',
              actionUrl: `/dashboard/campaigns/${campaign.id}`,
              metadata: { campaignId: campaign.id, campaignName: campaign.name }
            });
          }
        }
      }
    }

    // 7. Conversion rate insight
    const conversionStartDate = new Date(now.getTime() - analysisDays * 24 * 60 * 60 * 1000);
    const { data: conversions } = await supabase
      .from('conversion_events')
      .select('*')
      .eq('workspace_id', workspaceId)
      .gte('created_at', conversionStartDate.toISOString());

    if (conversions && conversions.length > 0 && currentClickCount > 0) {
      const conversionRate = (conversions.length / currentClickCount) * 100;

      if (conversionRate < 1) {
        insights.push({
          id: `conversion-low-${Date.now()}`,
          type: 'warning',
          category: 'conversion',
          severity: 'high',
          title: 'Low conversion rate',
          description: `Your conversion rate is ${conversionRate.toFixed(2)}%. Industry average is 2-5%. Review your funnel for drop-off points.`,
          impactScore: 80,
          actionLabel: 'View attribution',
          actionUrl: `/dashboard/attribution`,
          metadata: { conversionRate, conversions: conversions.length, clicks: currentClickCount }
        });
      } else if (conversionRate > 5) {
        insights.push({
          id: `conversion-high-${Date.now()}`,
          type: 'opportunity',
          category: 'conversion',
          severity: 'medium',
          title: 'Excellent conversion rate!',
          description: `Your ${conversionRate.toFixed(1)}% conversion rate is above average. Scale your best-performing channels.`,
          impactScore: 90,
          actionLabel: 'View top channels',
          actionUrl: `/dashboard/analytics?tab=channels`,
          metadata: { conversionRate, conversions: conversions.length, clicks: currentClickCount }
        });
      }
    }

    // 8. Total performance insight (always show if we have any clicks)
    if (totalAllTimeClicks && totalAllTimeClicks > 0) {
      const totalClicksFormatted = totalAllTimeClicks.toLocaleString();
      
      if (currentClickCount >= 10) {
        // Good activity - show summary insight
        insights.push({
          id: `total-performance-${Date.now()}`,
          type: 'trend',
          category: 'traffic',
          severity: 'low',
          title: `${totalClicksFormatted} total clicks`,
          description: `You've generated ${totalClicksFormatted} clicks all-time with ${currentClickCount} in ${periodLabel}. Your links are working!`,
          impactScore: Math.min(100, Math.round(Math.log10(totalAllTimeClicks) * 25)),
          actionLabel: 'View all analytics',
          actionUrl: `/dashboard/analytics`,
          metadata: { totalClicks: totalAllTimeClicks, recentClicks: currentClickCount, analysisDays }
        });
      } else if (currentClickCount > 0 && currentClickCount < 10) {
        // Some activity but not enough for full insights
        insights.push({
          id: `getting-started-${Date.now()}`,
          type: 'optimization',
          category: 'traffic',
          severity: 'low',
          title: 'Building momentum',
          description: `You have ${totalClicksFormatted} total clicks with ${currentClickCount} in ${periodLabel}. Keep sharing to unlock more insights.`,
          impactScore: 20,
          actionLabel: 'Share your links',
          actionUrl: `/dashboard/links`,
          metadata: { totalClicks: totalAllTimeClicks, recentClicks: currentClickCount }
        });
      } else {
        // No recent activity but has historical data
        insights.push({
          id: `reactivate-${Date.now()}`,
          type: 'warning',
          category: 'traffic',
          severity: 'medium',
          title: 'Time to reactivate',
          description: `You have ${totalClicksFormatted} all-time clicks but no recent activity. Share your links to get traffic flowing again.`,
          impactScore: 40,
          actionLabel: 'Share your links',
          actionUrl: `/dashboard/links`,
          metadata: { totalClicks: totalAllTimeClicks, recentClicks: 0 }
        });
      }
    }

    // Sort insights by severity and impact
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    insights.sort((a, b) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.impactScore - a.impactScore;
    });

    console.log(`Generated ${insights.length} insights for workspace ${workspaceId} (${periodLabel}, ${currentClickCount} clicks)`);

    return new Response(JSON.stringify({ 
      insights, 
      generatedAt: new Date().toISOString(),
      analysisPeriod: periodLabel,
      analysisDays,
      clicksAnalyzed: currentClickCount,
      totalAllTimeClicks: totalAllTimeClicks || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating smart insights:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
