import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify admin making the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: adminUser }, error: adminError } = await supabaseClient.auth.getUser(token);
    
    if (adminError || !adminUser) {
      throw new Error('Invalid admin token');
    }

    // Verify admin role
    const { data: adminRole, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', adminUser.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !adminRole) {
      console.error('Admin verification failed:', roleError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get target user from request
    const { target_user_id } = await req.json();
    
    if (!target_user_id) {
      throw new Error('target_user_id is required');
    }

    // Verify target user exists
    const { data: targetUser, error: targetError } = await supabaseClient.auth.admin.getUserById(target_user_id);
    
    if (targetError || !targetUser) {
      throw new Error('Target user not found');
    }

    // Generate impersonation session (24 hour expiry)
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.user.email!,
      options: {
        redirectTo: `${req.headers.get('origin')}/dashboard?impersonating=true`,
      }
    });

    if (sessionError || !sessionData) {
      console.error('Session generation failed:', sessionError);
      throw new Error('Failed to generate impersonation session');
    }

    console.log(`Admin ${adminUser.email} impersonating user ${targetUser.user.email}`);

    return new Response(
      JSON.stringify({
        success: true,
        impersonation_url: sessionData.properties.action_link,
        target_user: {
          id: targetUser.user.id,
          email: targetUser.user.email,
          full_name: targetUser.user.user_metadata?.full_name,
        },
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Impersonation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
