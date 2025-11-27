import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClaimRequest {
  code: string;
  userId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, userId }: ClaimRequest = await req.json();

    console.log('Admin claim attempt:', { userId, hasCode: !!code });

    // Validate input
    if (!code || !userId) {
      console.error('Missing code or userId');
      return new Response(
        JSON.stringify({ error: 'Code and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get secret code from environment
    const ADMIN_CLAIM_CODE = Deno.env.get('ADMIN_CLAIM_CODE');
    
    if (!ADMIN_CLAIM_CODE) {
      console.error('ADMIN_CLAIM_CODE not configured');
      return new Response(
        JSON.stringify({ error: 'Admin claim system not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate code
    if (code !== ADMIN_CLAIM_CODE) {
      console.warn('Invalid admin claim code attempt');
      return new Response(
        JSON.stringify({ error: 'Invalid code' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already has admin role
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    if (existingRole) {
      console.log('User already has admin role:', userId);
      return new Response(
        JSON.stringify({ success: true, message: 'Already an admin' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Grant admin role
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin'
      });

    if (insertError) {
      console.error('Failed to insert admin role:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to grant admin access' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the action for audit trail
    await supabase
      .from('admin_audit_logs')
      .insert({
        admin_user_id: userId,
        action: 'admin_claimed',
        resource_type: 'user_roles',
        resource_id: userId,
        new_values: { role: 'admin' }
      });

    console.log('Admin access granted successfully to:', userId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin access granted successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in claim-admin-access:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
