import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CleanupResult {
  workspace_id: string;
  workspace_name: string;
  retention_days: number;
  deleted_count: number;
  cutoff_date: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting analytics retention cleanup...');

    // Fetch all workspaces with their retention policies
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspaces')
      .select('id, name, analytics_retention_days')
      .neq('analytics_retention_days', -1); // Skip unlimited retention

    if (workspacesError) throw workspacesError;

    const results: CleanupResult[] = [];
    let totalDeleted = 0;

    for (const workspace of workspaces || []) {
      const retentionDays = workspace.analytics_retention_days || 90;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      console.log(`Cleaning workspace ${workspace.name} (${workspace.id}), retention: ${retentionDays} days`);

      // Delete old link_clicks for this workspace
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('id')
        .eq('workspace_id', workspace.id);

      if (linksError) {
        console.error(`Error fetching links for workspace ${workspace.id}:`, linksError);
        continue;
      }

      const linkIds = linksData?.map(l => l.id) || [];
      
      if (linkIds.length > 0) {
        const { count, error: deleteError } = await supabase
          .from('link_clicks')
          .delete({ count: 'exact' })
          .in('link_id', linkIds)
          .lt('clicked_at', cutoffDate.toISOString());

        if (deleteError) {
          console.error(`Error deleting clicks for workspace ${workspace.id}:`, deleteError);
          continue;
        }

        const deletedCount = count || 0;
        totalDeleted += deletedCount;

        results.push({
          workspace_id: workspace.id,
          workspace_name: workspace.name,
          retention_days: retentionDays,
          deleted_count: deletedCount,
          cutoff_date: cutoffDate.toISOString(),
        });

        console.log(`Deleted ${deletedCount} records for workspace ${workspace.name}`);
      }
    }

    // Log cleanup summary
    console.log(`Cleanup complete. Total records deleted: ${totalDeleted}`);

    return new Response(
      JSON.stringify({
        success: true,
        total_deleted: totalDeleted,
        workspaces_processed: results.length,
        results,
        timestamp: new Date().toISOString(),
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Cleanup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
