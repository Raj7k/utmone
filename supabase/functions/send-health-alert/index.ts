import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from 'https://esm.sh/resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workspaceId } = await req.json();

    if (!workspaceId) {
      return new Response(
        JSON.stringify({ error: 'Missing workspaceId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get unhealthy links for this workspace
    const { data: unhealthyLinks, error: linksError } = await supabase
      .from('links')
      .select('id, title, slug, destination_url, fallback_url')
      .eq('workspace_id', workspaceId)
      .eq('health_status', 'unhealthy')
      .limit(10);

    if (linksError) throw linksError;

    if (!unhealthyLinks || unhealthyLinks.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No unhealthy links found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get workspace owner email
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('owner_id, name')
      .eq('id', workspaceId)
      .single();

    if (workspaceError) throw workspaceError;

    const { data: owner, error: ownerError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', workspace.owner_id)
      .single();

    if (ownerError) throw ownerError;

    // Send email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured, skipping email');
      return new Response(
        JSON.stringify({ message: 'Email not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);

    const linksList = unhealthyLinks
      .map(link => {
        const fallbackNote = link.fallback_url 
          ? `✅ Auto-routing to fallback: ${link.fallback_url}` 
          : '⚠️ No fallback configured - clicks may be lost';
        return `• ${link.title}\n  Short URL: utm.one/${link.slug}\n  Destination: ${link.destination_url}\n  ${fallbackNote}`;
      })
      .join('\n\n');

    const { error: emailError } = await resend.emails.send({
      from: 'utm.one Health Monitor <alerts@utm.one>',
      to: owner.email,
      subject: `🚨 ${unhealthyLinks.length} Link${unhealthyLinks.length > 1 ? 's' : ''} Unhealthy - ${workspace.name}`,
      text: `Hi ${owner.full_name || 'there'},

Our automated health monitor detected ${unhealthyLinks.length} unhealthy link${unhealthyLinks.length > 1 ? 's' : ''} in your workspace "${workspace.name}".

These links are currently returning errors (404, 500, or timeout):

${linksList}

Recommended Actions:
1. Check if the destination URLs are still valid
2. Configure fallback URLs to prevent lost clicks
3. Update or pause these links if they're no longer needed

Links with fallback URLs are automatically routing traffic to the backup destination to prevent wasted clicks.

View details: https://utm.one/dashboard/link-health

Best,
utm.one Health Monitor`,
      html: `<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🚨 Link Health Alert</h2>
        <p>Hi ${owner.full_name || 'there'},</p>
        <p>Our automated health monitor detected <strong>${unhealthyLinks.length} unhealthy link${unhealthyLinks.length > 1 ? 's' : ''}</strong> in your workspace "${workspace.name}".</p>
        
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #991b1b;">Unhealthy Links:</h3>
          ${unhealthyLinks.map(link => `
            <div style="margin-bottom: 16px; padding: 12px; background: white; border-radius: 6px;">
              <strong>${link.title}</strong><br/>
              <span style="color: #64748b; font-size: 14px;">Short URL: utm.one/${link.slug}</span><br/>
              <span style="color: #64748b; font-size: 14px;">Destination: ${link.destination_url}</span><br/>
              ${link.fallback_url 
                ? `<span style="color: #059669; font-size: 14px;">✅ Auto-routing to fallback: ${link.fallback_url}</span>`
                : `<span style="color: #d97706; font-size: 14px;">⚠️ No fallback configured - clicks may be lost</span>`
              }
            </div>
          `).join('')}
        </div>

        <h3>Recommended Actions:</h3>
        <ol>
          <li>Check if the destination URLs are still valid</li>
          <li>Configure fallback URLs to prevent lost clicks</li>
          <li>Update or pause these links if they're no longer needed</li>
        </ol>

        <p style="margin-top: 24px;">
          <a href="https://utm.one/dashboard/link-health" style="display: inline-block; background: #191265; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Link Health Dashboard</a>
        </p>

        <p style="color: #64748b; font-size: 14px; margin-top: 32px;">
          Links with fallback URLs are automatically routing traffic to the backup destination to prevent wasted clicks.
        </p>

        <p style="color: #64748b; font-size: 12px; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          utm.one Health Monitor<br/>
          Automated link reliability system
        </p>
      </div>`,
    });

    if (emailError) {
      console.error('Email send error:', emailError);
      throw emailError;
    }

    console.log(`✅ Health alert sent to ${owner.email} for ${unhealthyLinks.length} unhealthy links`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailSent: true,
        unhealthyCount: unhealthyLinks.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Send health alert error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
