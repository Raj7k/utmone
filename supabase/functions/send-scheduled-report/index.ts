import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";

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
    const resendKey = Deno.env.get('RESEND_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendKey);

    const now = new Date().toISOString();

    // Fetch reports that are due to be sent
    const { data: reports, error: fetchError } = await supabase
      .from('scheduled_reports')
      .select('*')
      .eq('is_active', true)
      .lte('next_send_at', now);

    if (fetchError) {
      console.error('Error fetching reports:', fetchError);
      throw fetchError;
    }

    if (!reports || reports.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No reports to send' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`Processing ${reports.length} scheduled reports`);

    for (const report of reports) {
      try {
        // Fetch workspace data
        const { data: workspace } = await supabase
          .from('workspaces')
          .select('name')
          .eq('id', report.workspace_id)
          .single();

        // Fetch links data for the workspace
        const { data: links } = await supabase
          .from('links')
          .select('*, link_clicks(*)')
          .eq('workspace_id', report.workspace_id);

        if (!links || links.length === 0) {
          console.log(`No links found for workspace ${report.workspace_id}`);
          continue;
        }

        // Generate report data based on template
        const reportData = generateReportData(report.template_name, links);
        const htmlContent = generateReportHTML(report.template_name, reportData, workspace?.name);

        // Generate XLSX attachment
        const xlsxBuffer = generateXLSXAttachment(links);
        const xlsxBase64 = btoa(String.fromCharCode(...xlsxBuffer));

        // Send email with attachment
        const emailResult = await resend.emails.send({
          from: 'utm.one Reports <reports@send.utm.one>',
          reply_to: 'hello@send.utm.one',
          to: report.recipients,
          subject: getEmailSubject(report.template_name, workspace?.name),
          html: htmlContent,
          attachments: [
            {
              filename: `${report.template_name}_${new Date().toISOString().split('T')[0]}.xlsx`,
              content: xlsxBase64,
            },
          ],
        });

        console.log(`Email sent for report ${report.id}:`, emailResult);

        // Update report's last_sent_at and next_send_at
        const nextSendAt = calculateNextSendAt(report.frequency, report.custom_cron);
        await supabase
          .from('scheduled_reports')
          .update({
            last_sent_at: now,
            next_send_at: nextSendAt,
          })
          .eq('id', report.id);

        console.log(`Updated report ${report.id} - next send: ${nextSendAt}`);
      } catch (reportError) {
        console.error(`Error processing report ${report.id}:`, reportError);
      }
    }

    return new Response(
      JSON.stringify({ message: `Processed ${reports.length} reports` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in send-scheduled-report:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function generateReportData(template: string, links: any[]) {
  const totalClicks = links.reduce((sum, link) => sum + (link.total_clicks || 0), 0);
  const uniqueClicks = links.reduce((sum, link) => sum + (link.unique_clicks || 0), 0);
  const totalLinks = links.length;
  const activeLinks = links.filter(link => link.status === 'active').length;

  // Get top 5 performing links
  const topLinks = [...links]
    .sort((a, b) => (b.total_clicks || 0) - (a.total_clicks || 0))
    .slice(0, 5)
    .map(link => ({
      title: link.title,
      short_url: link.short_url,
      clicks: link.total_clicks || 0,
    }));

  // Campaign breakdown
  const campaigns = new Map<string, number>();
  links.forEach(link => {
    if (link.utm_campaign) {
      campaigns.set(
        link.utm_campaign,
        (campaigns.get(link.utm_campaign) || 0) + (link.total_clicks || 0)
      );
    }
  });

  const topCampaigns = Array.from(campaigns.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, clicks]) => ({ name, clicks }));

  return {
    totalClicks,
    uniqueClicks,
    totalLinks,
    activeLinks,
    topLinks,
    topCampaigns,
    period: template === 'weekly_summary' ? 'This Week' : 'This Month',
  };
}

function getEmailSubject(template: string, workspaceName?: string): string {
  const workspace = workspaceName ? ` - ${workspaceName}` : '';
  
  switch (template) {
    case 'weekly_summary':
      return `Weekly Analytics Summary${workspace}`;
    case 'monthly_overview':
      return `Monthly Analytics Overview${workspace}`;
    case 'campaign_performance':
      return `Campaign Performance Report${workspace}`;
    default:
      return `Analytics Report${workspace}`;
  }
}

function generateReportHTML(template: string, data: any, workspaceName?: string): string {
  const workspace = workspaceName || 'Your Workspace';
  
  const header = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #217EF1 0%, #5DABDB 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 8px 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0; }
        .metric-card { background: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; }
        .metric-value { font-size: 32px; font-weight: 700; color: #217EF1; margin: 0; }
        .metric-label { font-size: 14px; color: #666; margin: 4px 0 0; }
        .section { margin: 32px 0; }
        .section-title { font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #1a1a1a; }
        .link-item { background: #f8f9fa; border-radius: 6px; padding: 16px; margin-bottom: 12px; }
        .link-title { font-weight: 600; color: #1a1a1a; margin: 0 0 4px; }
        .link-url { font-size: 14px; color: #666; margin: 0 0 8px; }
        .link-clicks { font-size: 18px; font-weight: 700; color: #217EF1; }
        .footer { background: #1a1a1a; color: white; padding: 24px 30px; text-align: center; font-size: 14px; }
        .footer a { color: #5DABDB; text-decoration: none; }
        @media only screen and (max-width: 600px) {
          .metric-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${getEmailSubject(template)}</h1>
          <p>${workspace} • ${data.period}</p>
        </div>
        <div class="content">
  `;

  const footer = `
        </div>
        <div class="footer">
          <p>Powered by <a href="https://utm.one">utm.one</a></p>
          <p style="margin-top: 8px; opacity: 0.7;">Clarity Creates Confidence</p>
        </div>
      </div>
    </body>
    </html>
  `;

  let body = '';

  if (template === 'weekly_summary') {
    body = `
      <div class="metric-grid">
        <div class="metric-card">
          <p class="metric-value">${data.totalClicks.toLocaleString()}</p>
          <p class="metric-label">Total Clicks</p>
        </div>
        <div class="metric-card">
          <p class="metric-value">${data.uniqueClicks.toLocaleString()}</p>
          <p class="metric-label">Unique Visitors</p>
        </div>
        <div class="metric-card">
          <p class="metric-value">${data.totalLinks}</p>
          <p class="metric-label">Total Links</p>
        </div>
        <div class="metric-card">
          <p class="metric-value">${data.activeLinks}</p>
          <p class="metric-label">Active Links</p>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Top Performing Links</h2>
        ${data.topLinks.map((link: any) => `
          <div class="link-item">
            <p class="link-title">${link.title}</p>
            <p class="link-url">${link.short_url}</p>
            <p class="link-clicks">${link.clicks.toLocaleString()} clicks</p>
          </div>
        `).join('')}
      </div>
    `;
  } else if (template === 'monthly_overview') {
    body = `
      <div class="metric-grid">
        <div class="metric-card">
          <p class="metric-value">${data.totalClicks.toLocaleString()}</p>
          <p class="metric-label">Total Clicks</p>
        </div>
        <div class="metric-card">
          <p class="metric-value">${data.uniqueClicks.toLocaleString()}</p>
          <p class="metric-label">Unique Visitors</p>
        </div>
        <div class="metric-card">
          <p class="metric-value">${data.totalLinks}</p>
          <p class="metric-label">Total Links</p>
        </div>
        <div class="metric-card">
          <p class="metric-value">${((data.totalClicks / data.totalLinks) || 0).toFixed(1)}</p>
          <p class="metric-label">Avg Clicks/Link</p>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Top Campaigns</h2>
        ${data.topCampaigns.map((campaign: any) => `
          <div class="link-item">
            <p class="link-title">${campaign.name}</p>
            <p class="link-clicks">${campaign.clicks.toLocaleString()} clicks</p>
          </div>
        `).join('')}
      </div>
    `;
  } else if (template === 'campaign_performance') {
    body = `
      <div class="section">
        <h2 class="section-title">Campaign Performance</h2>
        ${data.topCampaigns.map((campaign: any) => `
          <div class="link-item">
            <p class="link-title">${campaign.name}</p>
            <p class="link-clicks">${campaign.clicks.toLocaleString()} total clicks</p>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h2 class="section-title">Top Performing Links</h2>
        ${data.topLinks.map((link: any) => `
          <div class="link-item">
            <p class="link-title">${link.title}</p>
            <p class="link-url">${link.short_url}</p>
            <p class="link-clicks">${link.clicks.toLocaleString()} clicks</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  return header + body + footer;
}

function generateXLSXAttachment(links: any[]): Uint8Array {
  const worksheet = XLSX.utils.json_to_sheet(
    links.map(link => ({
      'Title': link.title,
      'Short URL': link.short_url || '',
      'Destination': link.destination_url,
      'UTM Source': link.utm_source || '',
      'UTM Medium': link.utm_medium || '',
      'UTM Campaign': link.utm_campaign || '',
      'Total Clicks': link.total_clicks || 0,
      'Unique Clicks': link.unique_clicks || 0,
      'Status': link.status || 'active',
      'Created': link.created_at,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Links Analytics');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Uint8Array;
}

function calculateNextSendAt(frequency: string, customCron: string | null): string {
  const now = new Date();
  
  if (customCron) {
    return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  }

  switch (frequency) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    case 'monthly':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  }
}
