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
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Scheduled Reports] Checking for reports to send...');

    // Get reports that need to be sent
    const { data: reports, error: reportsError } = await supabase
      .from('scheduled_reports')
      .select('*')
      .eq('is_active', true)
      .lte('next_send_at', new Date().toISOString());

    if (reportsError) throw reportsError;

    if (!reports || reports.length === 0) {
      console.log('[Scheduled Reports] No reports to send.');
      return new Response(
        JSON.stringify({ success: true, sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let sentCount = 0;

    for (const report of reports) {
      try {
        console.log(`[Scheduled Reports] Processing report ${report.id} (${report.template_name})`);

        // Fetch report data based on template
        let reportData;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        if (report.template_name === 'weekly_summary') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          const { data: clicks } = await supabase
            .from('link_clicks')
            .select('*, links!inner(workspace_id, title)')
            .eq('links.workspace_id', report.workspace_id)
            .gte('clicked_at', sevenDaysAgo.toISOString());

          const totalClicks = clicks?.length || 0;
          const uniqueClicks = new Set(clicks?.map(c => `${c.ip_address}-${c.user_agent}`)).size;
          
          const linkStats = clicks?.reduce((acc, c) => {
            const linkTitle = c.links?.title || 'Untitled';
            acc[linkTitle] = (acc[linkTitle] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const topLinks = Object.entries(linkStats || {})
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 5);

          reportData = { totalClicks, uniqueClicks, topLinks, period: '7 days' };
        } else if (report.template_name === 'monthly_overview') {
          const { data: clicks } = await supabase
            .from('link_clicks')
            .select('*, links!inner(workspace_id, utm_campaign)')
            .eq('links.workspace_id', report.workspace_id)
            .gte('clicked_at', thirtyDaysAgo.toISOString());

          const totalClicks = clicks?.length || 0;
          const campaigns = clicks?.reduce((acc, c) => {
            const campaign = c.links?.utm_campaign || 'no campaign';
            acc[campaign] = (acc[campaign] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          reportData = { totalClicks, campaigns, period: '30 days' };
        } else {
          // campaign_performance
          const { data: clicks } = await supabase
            .from('link_clicks')
            .select('*, links!inner(workspace_id, utm_campaign)')
            .eq('links.workspace_id', report.workspace_id)
            .gte('clicked_at', thirtyDaysAgo.toISOString());

          const campaigns = clicks?.reduce((acc, c) => {
            const campaign = c.links?.utm_campaign || 'no campaign';
            if (!acc[campaign]) acc[campaign] = { clicks: 0, unique: new Set() };
            acc[campaign].clicks++;
            acc[campaign].unique.add(`${c.ip_address}-${c.user_agent}`);
            return acc;
          }, {} as Record<string, any>);

          reportData = { campaigns, period: '30 days' };
        }

        // Generate HTML email
        const htmlContent = generateReportHTML(report.template_name, reportData);

        // Send email via Resend
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'utm.one Reports <reports@utm.one>',
            to: report.recipients,
            subject: `utm.one ${report.template_name.replace('_', ' ')} - ${new Date().toLocaleDateString()}`,
            html: htmlContent,
          }),
        });

        if (!emailResponse.ok) {
          throw new Error(`Failed to send email: ${await emailResponse.text()}`);
        }

        // Update report
        const nextSendAt = calculateNextSendAt(report.frequency, report.custom_cron);
        await supabase
          .from('scheduled_reports')
          .update({
            last_sent_at: new Date().toISOString(),
            next_send_at: nextSendAt,
          })
          .eq('id', report.id);

        sentCount++;
        console.log(`[Scheduled Reports] Successfully sent report ${report.id}`);

      } catch (error) {
        console.error(`[Scheduled Reports] Error processing report ${report.id}:`, error);
        // Continue with next report
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent: sentCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Scheduled Reports] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateReportHTML(template: string, data: any): string {
  const header = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">utm.one analytics report</h1>
      <p style="color: #666; margin-bottom: 32px;">${template.replace('_', ' ')} for ${data.period}</p>
  `;

  const footer = `
      <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #eee; color: #999; font-size: 14px;">
        <p>sent by utm.one — the link management platform built for teams</p>
      </div>
    </div>
  `;

  if (template === 'weekly_summary') {
    return header + `
      <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="font-size: 18px; margin-bottom: 16px;">summary</h2>
        <p style="font-size: 32px; font-weight: 700; margin: 0;">${data.totalClicks}</p>
        <p style="color: #666; margin-top: 4px;">total clicks</p>
        <p style="font-size: 24px; font-weight: 600; margin-top: 16px;">${data.uniqueClicks}</p>
        <p style="color: #666; margin-top: 4px;">unique visitors</p>
      </div>
      <h2 style="font-size: 18px; margin-bottom: 16px;">top performing links</h2>
      <ul style="list-style: none; padding: 0;">
        ${data.topLinks.map(([title, count]: [string, number]) => `
          <li style="padding: 12px; background: #f9fafb; margin-bottom: 8px; border-radius: 4px;">
            <strong>${title}</strong>: ${count} clicks
          </li>
        `).join('')}
      </ul>
    ` + footer;
  }

  return header + '<p>Report data will be displayed here.</p>' + footer;
}

function calculateNextSendAt(frequency: string, customCron: string | null): string {
  const now = new Date();
  if (frequency === 'daily') {
    now.setDate(now.getDate() + 1);
    now.setHours(8, 0, 0, 0); // 8am next day
  } else if (frequency === 'weekly') {
    now.setDate(now.getDate() + 7);
    now.setHours(8, 0, 0, 0);
  } else if (frequency === 'monthly') {
    now.setMonth(now.getMonth() + 1);
    now.setHours(8, 0, 0, 0);
  }
  return now.toISOString();
}
