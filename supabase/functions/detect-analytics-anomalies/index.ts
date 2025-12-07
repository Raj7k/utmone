import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Z-Score calculation for statistical anomaly detection
function calculateZScore(values: number[], currentValue: number): { zScore: number; mean: number; stdDev: number } {
  if (values.length === 0) return { zScore: 0, mean: 0, stdDev: 0 };
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Avoid division by zero
  const zScore = stdDev > 0 ? (currentValue - mean) / stdDev : 0;
  
  return { zScore, mean, stdDev };
}

// Get hourly click counts for the past N days
async function getHourlyClicks(
  supabase: any,
  linkId: string,
  days: number
): Promise<number[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data: clicks } = await supabase
    .from('link_clicks')
    .select('clicked_at')
    .eq('link_id', linkId)
    .gte('clicked_at', startDate.toISOString());
  
  if (!clicks || clicks.length === 0) return [];
  
  // Group by hour
  const hourlyBuckets: Record<string, number> = {};
  clicks.forEach((click: { clicked_at: string }) => {
    const hour = new Date(click.clicked_at).toISOString().slice(0, 13); // YYYY-MM-DDTHH
    hourlyBuckets[hour] = (hourlyBuckets[hour] || 0) + 1;
  });
  
  return Object.values(hourlyBuckets);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Pulse Watchdog] Starting anomaly detection run...');

    // Get all workspaces with their notification settings
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspaces')
      .select(`
        id,
        name,
        workspace_notification_settings (
          email_enabled,
          email_recipients,
          slack_enabled,
          slack_webhook_url_encrypted,
          anomaly_threshold,
          quiet_hours_start,
          quiet_hours_end,
          debounce_hours,
          spike_alerts_enabled,
          drop_alerts_enabled,
          new_source_alerts_enabled
        )
      `);

    if (workspacesError) throw workspacesError;

    let totalAnomalies = 0;
    let notificationsSent = 0;

    for (const workspace of workspaces || []) {
      const settingsArray = workspace.workspace_notification_settings as any[];
      const settings = settingsArray?.[0] || {
        anomaly_threshold: 3.0,
        debounce_hours: 24,
        spike_alerts_enabled: true,
        drop_alerts_enabled: true,
        new_source_alerts_enabled: true,
      };

      const threshold = settings.anomaly_threshold || 3.0;
      const debounceHours = settings.debounce_hours || 24;

      console.log(`[Pulse Watchdog] Processing workspace ${workspace.id} (threshold: ${threshold}σ)`);

      // Check quiet hours
      const now = new Date();
      const currentHour = now.getUTCHours();
      if (settings.quiet_hours_start !== null && settings.quiet_hours_end !== null) {
        const start = settings.quiet_hours_start;
        const end = settings.quiet_hours_end;
        const isQuietHours = start < end
          ? currentHour >= start && currentHour < end
          : currentHour >= start || currentHour < end;
        
        if (isQuietHours) {
          console.log(`[Pulse Watchdog] Skipping workspace ${workspace.id} - quiet hours`);
          continue;
        }
      }

      // Get active links with significant traffic
      const { data: links } = await supabase
        .from('links')
        .select('id, title, short_url, total_clicks')
        .eq('workspace_id', workspace.id)
        .eq('status', 'active')
        .gt('total_clicks', 10);

      if (!links || links.length === 0) continue;

      for (const link of links) {
        // Check debounce - don't alert if we recently sent one for this link
        const debounceThreshold = new Date();
        debounceThreshold.setHours(debounceThreshold.getHours() - debounceHours);

        const { data: recentAlerts } = await supabase
          .from('analytics_anomalies')
          .select('id, notification_sent_at')
          .eq('link_id', link.id)
          .gte('notification_sent_at', debounceThreshold.toISOString())
          .limit(1);

        if (recentAlerts && recentAlerts.length > 0) {
          console.log(`[Pulse Watchdog] Skipping link ${link.id} - debounced`);
          continue;
        }

        // Get hourly clicks for last 7 days (baseline)
        const hourlyClicks = await getHourlyClicks(supabase, link.id, 7);
        
        if (hourlyClicks.length < 24) continue; // Need at least 24 hours of data

        // Get current hour's clicks
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        
        const { data: currentHourClicks } = await supabase
          .from('link_clicks')
          .select('id')
          .eq('link_id', link.id)
          .gte('clicked_at', oneHourAgo.toISOString());

        const currentCount = currentHourClicks?.length || 0;
        const { zScore, mean, stdDev } = calculateZScore(hourlyClicks, currentCount);

        console.log(`[Pulse Watchdog] Link ${link.id}: current=${currentCount}, mean=${mean.toFixed(2)}, stdDev=${stdDev.toFixed(2)}, z=${zScore.toFixed(2)}`);

        // SPIKE Detection: z-score > threshold (typically 3σ)
        if (settings.spike_alerts_enabled && zScore > threshold) {
          const changePercent = mean > 0 ? Math.round(((currentCount - mean) / mean) * 100) : 0;
          
          const { data: anomaly, error: insertError } = await supabase
            .from('analytics_anomalies')
            .insert({
              workspace_id: workspace.id,
              link_id: link.id,
              anomaly_type: 'traffic_spike',
              severity: zScore > threshold * 1.5 ? 'critical' : 'high',
              title: `🚀 viral alert: "${link.title}" is surging`,
              description: `this link received ${currentCount} clicks in the last hour, ${changePercent}% above normal (expected: ~${Math.round(mean)} clicks/hour).`,
              baseline_value: mean,
              current_value: currentCount,
              change_percent: changePercent,
              metadata: { z_score: zScore, std_dev: stdDev },
            })
            .select()
            .single();

          if (!insertError && anomaly) {
            totalAnomalies++;
            
            // Trigger notification
            const notificationSent = await sendAnomalyNotification(supabase, workspace, settings, anomaly, link);
            if (notificationSent) {
              notificationsSent++;
              await supabase
                .from('analytics_anomalies')
                .update({ notification_sent_at: new Date().toISOString() })
                .eq('id', anomaly.id);
            }
          }
        }

        // DROP Detection: z-score < -threshold AND mean > 10 (meaningful traffic)
        if (settings.drop_alerts_enabled && zScore < -threshold && mean > 10) {
          const changePercent = Math.round(((currentCount - mean) / mean) * 100);
          
          const { data: anomaly, error: insertError } = await supabase
            .from('analytics_anomalies')
            .insert({
              workspace_id: workspace.id,
              link_id: link.id,
              anomaly_type: 'traffic_drop',
              severity: zScore < -threshold * 1.5 ? 'critical' : 'high',
              title: `⚠️ traffic drop: "${link.title}" went quiet`,
              description: `this link received only ${currentCount} clicks in the last hour, ${Math.abs(changePercent)}% below normal (expected: ~${Math.round(mean)} clicks/hour).`,
              baseline_value: mean,
              current_value: currentCount,
              change_percent: changePercent,
              metadata: { z_score: zScore, std_dev: stdDev },
            })
            .select()
            .single();

          if (!insertError && anomaly) {
            totalAnomalies++;
            
            const notificationSent = await sendAnomalyNotification(supabase, workspace, settings, anomaly, link);
            if (notificationSent) {
              notificationsSent++;
              await supabase
                .from('analytics_anomalies')
                .update({ notification_sent_at: new Date().toISOString() })
                .eq('id', anomaly.id);
            }
          }
        }
      }

      // Check for new referrer sources (workspace-level)
      if (settings.new_source_alerts_enabled) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const { data: historicalReferrers } = await supabase
          .from('link_clicks')
          .select('referrer, links!inner(workspace_id)')
          .eq('links.workspace_id', workspace.id)
          .gte('clicked_at', sevenDaysAgo.toISOString())
          .lt('clicked_at', oneDayAgo.toISOString());

        const { data: todayReferrers } = await supabase
          .from('link_clicks')
          .select('referrer, links!inner(workspace_id)')
          .eq('links.workspace_id', workspace.id)
          .gte('clicked_at', oneDayAgo.toISOString());

        const historicalSet = new Set(
          (historicalReferrers || [])
            .map((r: any) => r.referrer)
            .filter((r: string) => r && r !== 'direct')
        );

        const todayCounts: Record<string, number> = {};
        (todayReferrers || []).forEach((r: any) => {
          if (r.referrer && r.referrer !== 'direct') {
            todayCounts[r.referrer] = (todayCounts[r.referrer] || 0) + 1;
          }
        });

        // Find new referrers with significant traffic
        for (const [referrer, count] of Object.entries(todayCounts)) {
          if (!historicalSet.has(referrer) && count >= 5) {
            let hostname = referrer;
            try {
              hostname = new URL(referrer).hostname;
            } catch {
              // Keep original if not a valid URL
            }
            
            const { data: anomaly, error: insertError } = await supabase
              .from('analytics_anomalies')
              .insert({
                workspace_id: workspace.id,
                anomaly_type: 'new_referrer',
                severity: count > 20 ? 'high' : 'medium',
                title: `🆕 new traffic source: ${hostname}`,
                description: `you received ${count} clicks from ${referrer} today — this is a new traffic source for your workspace.`,
                current_value: count,
                metadata: { referrer },
              })
              .select()
              .single();

            if (!insertError && anomaly) {
              totalAnomalies++;
              
              const notificationSent = await sendAnomalyNotification(supabase, workspace, settings, anomaly, null);
              if (notificationSent) {
                notificationsSent++;
                await supabase
                  .from('analytics_anomalies')
                  .update({ notification_sent_at: new Date().toISOString() })
                  .eq('id', anomaly.id);
              }
            }
          }
        }
      }
    }

    console.log(`[Pulse Watchdog] Completed. Found ${totalAnomalies} anomalies, sent ${notificationsSent} notifications.`);

    return new Response(
      JSON.stringify({ success: true, anomalies: totalAnomalies, notifications: notificationsSent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Pulse Watchdog] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Send notification via configured channels
async function sendAnomalyNotification(
  supabase: any,
  workspace: { id: string; name: string },
  settings: any,
  anomaly: any,
  link: { id: string; title: string; short_url: string } | null
): Promise<boolean> {
  let sent = false;

  try {
    // Invoke the dedicated send-anomaly-alert function
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-anomaly-alert`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({
          workspaceId: workspace.id,
          workspaceName: workspace.name,
          anomaly,
          link,
          settings,
        }),
      }
    );

    if (response.ok) {
      sent = true;
      console.log(`[Pulse Watchdog] Notification sent for anomaly ${anomaly.id}`);
    } else {
      console.error(`[Pulse Watchdog] Failed to send notification:`, await response.text());
    }
  } catch (error) {
    console.error('[Pulse Watchdog] Notification error:', error);
  }

  return sent;
}
