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

    console.log('Starting automated GitHub backup cron job');

    // Fetch all workspaces with active GitHub backup configuration
    const { data: integrations, error: integrationsError } = await supabase
      .from('integrations')
      .select('workspace_id, access_token, config')
      .eq('provider', 'github')
      .eq('is_active', true);

    if (integrationsError) {
      console.error('Error fetching GitHub integrations:', integrationsError);
      throw integrationsError;
    }

    if (!integrations || integrations.length === 0) {
      console.log('No active GitHub backups configured');
      return new Response(
        JSON.stringify({ message: 'No active GitHub backups configured', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${integrations.length} workspace(s) with GitHub backup enabled`);

    const results = [];

    // Process each workspace
    for (const integration of integrations) {
      const workspaceId = integration.workspace_id;
      const githubToken = integration.access_token;
      const repository = integration.config?.repository;

      if (!githubToken || !repository) {
        console.error(`Missing GitHub configuration for workspace ${workspaceId}`);
        await logBackup(supabase, workspaceId, 'failed', null, 'Missing GitHub token or repository');
        continue;
      }

      try {
        console.log(`Backing up workspace ${workspaceId} to ${repository}`);

        // Export links data for this workspace
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
          console.error(`Error exporting links for workspace ${workspaceId}:`, linksError);
          await logBackup(supabase, workspaceId, 'failed', null, linksError.message);
          continue;
        }

        const backupData = {
          exported_at: new Date().toISOString(),
          workspace_id: workspaceId,
          total_links: links?.length || 0,
          links: links || [],
        };

        // Create GitHub commit
        const dateStr = new Date().toISOString().split('T')[0];
        const fileName = `backup-${workspaceId}-${dateStr}.json`;
        const filePath = `backups/${fileName}`;

        // Push to GitHub using GitHub API
        const [owner, repo] = repository.split('/');
        
        // Get current file SHA if it exists (for updating)
        let sha: string | null = null;
        try {
          const getResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
            {
              headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github+json',
              },
            }
          );
          if (getResponse.ok) {
            const existingFile = await getResponse.json();
            sha = existingFile.sha;
          }
        } catch (e) {
          // File doesn't exist yet, which is fine
          console.log(`Creating new backup file: ${filePath}`);
        }

        // Create or update file
        const content = btoa(JSON.stringify(backupData, null, 2));
        const commitResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `Automated backup for workspace ${workspaceId} - ${dateStr}`,
              content: content,
              ...(sha ? { sha } : {}),
            }),
          }
        );

        if (!commitResponse.ok) {
          const errorData = await commitResponse.text();
          console.error(`GitHub API error for workspace ${workspaceId}:`, errorData);
          await logBackup(supabase, workspaceId, 'failed', filePath, `GitHub API error: ${errorData}`);
          continue;
        }

        console.log(`Successfully backed up workspace ${workspaceId} to ${filePath}`);
        await logBackup(supabase, workspaceId, 'success', filePath, null);
        
        results.push({
          workspace_id: workspaceId,
          status: 'success',
          file_path: filePath,
        });
      } catch (error: any) {
        console.error(`Error backing up workspace ${workspaceId}:`, error);
        await logBackup(supabase, workspaceId, 'failed', null, error.message);
        results.push({
          workspace_id: workspaceId,
          status: 'failed',
          error: error.message,
        });
      }
    }

    console.log(`Backup cron job completed. Processed ${results.length} workspace(s)`);

    return new Response(
      JSON.stringify({ 
        message: 'Backup cron job completed',
        processed: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Fatal error in backup cron job:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function logBackup(
  supabase: any,
  workspaceId: string,
  status: 'success' | 'failed',
  filePath: string | null,
  errorMessage: string | null
) {
  const { error } = await supabase
    .from('backup_logs')
    .insert({
      workspace_id: workspaceId,
      backup_type: 'github',
      status,
      file_path: filePath,
      error_message: errorMessage,
    });

  if (error) {
    console.error('Error logging backup:', error);
  }
}
