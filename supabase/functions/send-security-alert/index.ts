import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityAlertPayload {
  workspaceId: string;
  actorId: string;
  eventType: string;
  metadata: {
    threshold: number;
    actual_count: number;
    window: string;
    severity: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: SecurityAlertPayload = await req.json();
    
    // Get workspace owner email
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('name, owner_id, profiles!workspaces_owner_id_fkey(email, full_name)')
      .eq('id', payload.workspaceId)
      .single();

    if (workspaceError || !workspace) {
      throw new Error('Failed to fetch workspace');
    }

    // Get actor details
    const { data: actor } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', payload.actorId)
      .single();

    const ownerProfile = workspace.profiles as any;
    const ownerEmail = ownerProfile?.email;
    const ownerName = ownerProfile?.full_name || ownerEmail;
    const actorName = actor?.full_name || actor?.email || 'Unknown user';

    if (!ownerEmail) {
      throw new Error('No owner email found');
    }

    // Send email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const emailSubject = `🚨 Security Alert: Suspicious Activity Detected in ${workspace.name}`;
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .metric { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .metric strong { display: block; font-size: 24px; color: #dc2626; margin-bottom: 5px; }
    .cta-button { display: inline-block; background: #191265; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1 style="color: #dc2626;">🚨 Security Alert</h1>
    
    <div class="alert-box">
      <h2>Suspicious Activity Detected</h2>
      <p>We detected unusual behavior in your workspace <strong>${workspace.name}</strong>.</p>
    </div>

    <div class="metric">
      <strong>${payload.metadata.actual_count}</strong>
      <span>Delete operations in ${payload.metadata.window}</span>
    </div>

    <p><strong>User:</strong> ${actorName}</p>
    <p><strong>Threshold:</strong> ${payload.metadata.threshold} operations per minute</p>
    <p><strong>Severity:</strong> ${payload.metadata.severity.toUpperCase()}</p>

    <h3>What happened?</h3>
    <p>
      The user "${actorName}" performed ${payload.metadata.actual_count} delete operations 
      within ${payload.metadata.window}, which exceeds our security threshold of 
      ${payload.metadata.threshold} operations.
    </p>

    <h3>Recommended Actions</h3>
    <ul>
      <li>Review recent audit logs for this user</li>
      <li>Verify if this was intentional bulk deletion</li>
      <li>Consider temporarily suspending the user's access</li>
      <li>Contact the user to confirm their activity</li>
    </ul>

    <a href="https://utm.one/settings?tab=security" class="cta-button">
      View Audit Logs
    </a>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    
    <p style="font-size: 12px; color: #6b7280;">
      This is an automated security alert from utm.one. 
      If you have questions, contact security@utm.one
    </p>
  </div>
</body>
</html>
    `;

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'utm.one Security <security@utm.one>',
        to: [ownerEmail],
        subject: emailSubject,
        html: emailBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Failed to send email: ${errorText}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Security alert sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending security alert:', error);
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
