import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check using existing rate_limit_log table
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limit: max 5 requests per minute per IP
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { data: recentAttempts } = await supabase
      .from('rate_limit_log')
      .select('attempt_count')
      .eq('ip_address', clientIp)
      .eq('endpoint', 'get-invitation-by-token')
      .gte('window_start', oneMinuteAgo);

    const totalAttempts = recentAttempts?.reduce((sum, r) => sum + (r.attempt_count || 0), 0) || 0;
    
    if (totalAttempts >= 5) {
      console.log(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log this attempt
    await supabase.from('rate_limit_log').insert({
      ip_address: clientIp,
      endpoint: 'get-invitation-by-token',
      attempt_count: 1,
      window_start: new Date().toISOString()
    });

    // Fetch invitation details (only non-sensitive fields)
    const { data: invitation, error } = await supabase
      .from('workspace_invitations')
      .select('email, role, workspace_id, invited_by_name, status, expires_at')
      .eq('token', token)
      .single();

    if (error || !invitation) {
      console.log('Invitation not found or error:', error);
      return new Response(
        JSON.stringify({ error: 'This invitation may have expired or already been used. Please request a new invitation.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate invitation status
    if (invitation.status !== 'pending') {
      return new Response(
        JSON.stringify({ error: 'This invitation has already been accepted or is no longer valid.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate expiration
    if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'This invitation has expired. Please request a new invitation.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch workspace name
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('name')
      .eq('id', invitation.workspace_id)
      .single();

    // Return only necessary fields
    const response = {
      email: invitation.email,
      role: invitation.role,
      workspaceName: workspace?.name || 'a workspace',
      inviterName: invitation.invited_by_name || 'A team member',
    };

    console.log('Successfully retrieved invitation for:', invitation.email);

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-invitation-by-token:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
