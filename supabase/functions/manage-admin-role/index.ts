import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ManageAdminRoleRequest {
  targetUserId: string;
  action: 'grant' | 'revoke';
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the current user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify requesting user is an admin
    const { data: adminRole, error: adminCheckError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (adminCheckError || !adminRole) {
      console.error('Admin check error:', adminCheckError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { targetUserId, action }: ManageAdminRoleRequest = await req.json();

    console.log('Admin role management:', { requestingUser: user.id, targetUserId, action });

    // Validate input
    if (!targetUserId || !action) {
      return new Response(
        JSON.stringify({ error: 'targetUserId and action are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action !== 'grant' && action !== 'revoke') {
      return new Response(
        JSON.stringify({ error: 'Action must be "grant" or "revoke"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prevent self-revocation if user is the last admin
    if (action === 'revoke' && targetUserId === user.id) {
      const { count, error: countError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      if (countError) {
        console.error('Error counting admins:', countError);
        return new Response(
          JSON.stringify({ error: 'Failed to verify admin count' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (count === 1) {
        return new Response(
          JSON.stringify({ error: 'Cannot revoke the last admin role' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (action === 'grant') {
      // Check if user already has admin role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', targetUserId)
        .eq('role', 'admin')
        .maybeSingle();

      if (existingRole) {
        return new Response(
          JSON.stringify({ success: true, message: 'User already has admin role' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Grant admin role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: targetUserId,
          role: 'admin'
        });

      if (insertError) {
        console.error('Failed to grant admin role:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to grant admin role' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Log the action
      await supabase
        .from('admin_audit_logs')
        .insert({
          admin_user_id: user.id,
          action: 'admin_granted',
          resource_type: 'user_roles',
          resource_id: targetUserId,
          new_values: { role: 'admin' }
        });

      console.log('Admin role granted successfully to:', targetUserId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin role granted successfully' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Revoke admin role
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', targetUserId)
        .eq('role', 'admin');

      if (deleteError) {
        console.error('Failed to revoke admin role:', deleteError);
        return new Response(
          JSON.stringify({ error: 'Failed to revoke admin role' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Log the action
      await supabase
        .from('admin_audit_logs')
        .insert({
          admin_user_id: user.id,
          action: 'admin_revoked',
          resource_type: 'user_roles',
          resource_id: targetUserId,
          old_values: { role: 'admin' }
        });

      console.log('Admin role revoked successfully from:', targetUserId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin role revoked successfully' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in manage-admin-role:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
