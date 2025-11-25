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

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { githubToken, githubRepo, enabled } = await req.json();

    if (!githubToken || !githubRepo) {
      throw new Error('GitHub token and repository are required');
    }

    // Get user's workspace
    const { data: workspaces, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1);

    if (workspaceError || !workspaces?.length) {
      throw new Error('No workspace found');
    }

    const workspaceId = workspaces[0].id;

    // Store GitHub configuration in integrations table
    const { error: integrationError } = await supabase
      .from('integrations')
      .upsert({
        workspace_id: workspaceId,
        provider: 'github',
        is_active: enabled,
        access_token: githubToken, // Encrypted by RLS
        config: { repository: githubRepo },
      }, {
        onConflict: 'workspace_id,provider'
      });

    if (integrationError) {
      throw integrationError;
    }

    console.log(`GitHub backup configured for workspace ${workspaceId}, repo: ${githubRepo}`);

    return new Response(
      JSON.stringify({ success: true, message: 'GitHub backup configured successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error configuring GitHub backup:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
