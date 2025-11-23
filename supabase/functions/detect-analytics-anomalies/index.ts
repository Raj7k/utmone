import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Anomaly Detection] Starting detection run...');

    // Get all workspaces
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspaces')
      .select('id');

    if (workspacesError) throw workspacesError;

    let totalAnomalies = 0;

    for (const workspace of workspaces || []) {
      console.log(`[Anomaly Detection] Processing workspace ${workspace.id}`);

      // Get clicks from last 7 days for baseline
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentClicks, error: clicksError } = await supabase
        .from('link_clicks')
        .select('*, links!inner(workspace_id)')
        .eq('links.workspace_id', workspace.id)
        .gte('clicked_at', sevenDaysAgo.toISOString());

      if (clicksError) {
        console.error(`[Anomaly Detection] Error fetching clicks for workspace ${workspace.id}:`, clicksError);
        continue;
      }

      if (!recentClicks || recentClicks.length === 0) continue;

      // Calculate baselines
      const dailyClicks = recentClicks.length / 7;
      const countries = recentClicks.reduce((acc, c) => {
        if (c.country) acc[c.country] = (acc[c.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const referrers = recentClicks.reduce((acc, c) => {
        if (c.referrer && c.referrer !== 'direct') acc[c.referrer] = (acc[c.referrer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get last 24 hours for anomaly detection
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { data: todayClicks } = await supabase
        .from('link_clicks')
        .select('*, links!inner(workspace_id)')
        .eq('links.workspace_id', workspace.id)
        .gte('clicked_at', oneDayAgo.toISOString());

      const todayCount = todayClicks?.length || 0;

      // ANOMALY 1: Traffic Spike (3x above average)
      if (todayCount > dailyClicks * 3) {
        const changePercent = Math.round(((todayCount - dailyClicks) / dailyClicks) * 100);
        await supabase.from('analytics_anomalies').insert({
          workspace_id: workspace.id,
          anomaly_type: 'traffic_spike',
          severity: todayCount > dailyClicks * 5 ? 'critical' : 'high',
          title: 'unusual traffic spike detected',
          description: `your links received ${todayCount} clicks today, ${changePercent}% above your 7-day average of ${Math.round(dailyClicks)} clicks per day.`,
          baseline_value: dailyClicks,
          current_value: todayCount,
          change_percent: changePercent,
        });
        totalAnomalies++;
      }

      // ANOMALY 2: New Country in Top 3
      const todayCountries = (todayClicks || []).reduce((acc, c) => {
        if (c.country) acc[c.country] = (acc[c.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const top3Countries = Object.entries(todayCountries)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3);

      for (const [country, count] of top3Countries) {
        if (!countries[country] || countries[country] < 5) {
          await supabase.from('analytics_anomalies').insert({
            workspace_id: workspace.id,
            anomaly_type: 'new_country',
            severity: 'medium',
            title: `new traffic source: ${country}`,
            description: `you received ${count} clicks from ${country} today, which wasn't in your top traffic sources before.`,
            current_value: count as number,
            metadata: { country },
          });
          totalAnomalies++;
        }
      }

      // ANOMALY 3: CTR Drop (50%+ decrease)
      const { data: links } = await supabase
        .from('links')
        .select('id, total_clicks')
        .eq('workspace_id', workspace.id)
        .gt('total_clicks', 50);

      if (links) {
        for (const link of links) {
          const { data: linkClicksLast7 } = await supabase
            .from('link_clicks')
            .select('id')
            .eq('link_id', link.id)
            .gte('clicked_at', sevenDaysAgo.toISOString());

          const { data: linkClicksToday } = await supabase
            .from('link_clicks')
            .select('id')
            .eq('link_id', link.id)
            .gte('clicked_at', oneDayAgo.toISOString());

          const avgLast7 = (linkClicksLast7?.length || 0) / 7;
          const today = linkClicksToday?.length || 0;

          if (avgLast7 > 5 && today < avgLast7 * 0.5) {
            const changePercent = Math.round(((today - avgLast7) / avgLast7) * 100);
            await supabase.from('analytics_anomalies').insert({
              workspace_id: workspace.id,
              link_id: link.id,
              anomaly_type: 'ctr_drop',
              severity: today < avgLast7 * 0.3 ? 'high' : 'medium',
              title: 'click rate dropped significantly',
              description: `one of your links received only ${today} clicks today, down ${Math.abs(changePercent)}% from its 7-day average of ${Math.round(avgLast7)}.`,
              baseline_value: avgLast7,
              current_value: today,
              change_percent: changePercent,
            });
            totalAnomalies++;
          }
        }
      }

      // ANOMALY 4: New Referrer in Top 3
      const todayReferrers = (todayClicks || []).reduce((acc, c) => {
        if (c.referrer && c.referrer !== 'direct') acc[c.referrer] = (acc[c.referrer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const top3Referrers = Object.entries(todayReferrers)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3);

      for (const [referrer, count] of top3Referrers) {
        if (!referrers[referrer] || referrers[referrer] < 5) {
          await supabase.from('analytics_anomalies').insert({
            workspace_id: workspace.id,
            anomaly_type: 'new_referrer',
            severity: 'low',
            title: `new referrer: ${referrer}`,
            description: `you received ${count} clicks from ${referrer} today, a new traffic source for your workspace.`,
            current_value: count as number,
            metadata: { referrer },
          });
          totalAnomalies++;
        }
      }
    }

    console.log(`[Anomaly Detection] Completed. Found ${totalAnomalies} anomalies.`);

    return new Response(
      JSON.stringify({ success: true, anomalies: totalAnomalies }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Anomaly Detection] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
