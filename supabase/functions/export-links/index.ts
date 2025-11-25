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

    // Export all links for this workspace
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select(`
        *,
        link_clicks (
          clicked_at,
          country,
          city,
          device_type,
          browser,
          os
        )
      `)
      .eq('workspace_id', workspaceId);

    if (linksError) {
      throw linksError;
    }

    const exportData = {
      exported_at: new Date().toISOString(),
      workspace_id: workspaceId,
      total_links: links?.length || 0,
      links: links || [],
    };

    console.log(`Exported ${links?.length || 0} links for workspace ${workspaceId}`);

    return new Response(
      JSON.stringify(exportData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error exporting links:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
