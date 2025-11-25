import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GitHubBackupPayload {
  workspaceId: string;
  manual?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { workspaceId, manual = false }: GitHubBackupPayload = await req.json();

    console.log(`Starting GitHub backup for workspace: ${workspaceId}`);

    // Fetch workspace integration
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('provider', 'github')
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      console.error('No active GitHub integration found:', integrationError);
      return new Response(
        JSON.stringify({ error: 'GitHub integration not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all workspace data
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select(`
        *,
        link_clicks(count),
        qr_codes(*),
        link_tags(*)
      `)
      .eq('workspace_id', workspaceId);

    if (linksError) {
      console.error('Error fetching links:', linksError);
      throw linksError;
    }

    // Fetch workspace info
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspaceId)
      .single();

    // Prepare backup data
    const backupData = {
      workspace,
      links,
      backup_metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        total_links: links?.length || 0,
        manual_backup: manual,
      },
    };

    // Get GitHub config from integration
    const config = integration.config as any;
    const repoOwner = config.repo_owner;
    const repoName = config.repo_name;
    const accessToken = integration.access_token;

    // Create backup file in GitHub
    const fileName = `backup-${new Date().toISOString().split('T')[0]}.json`;
    const filePath = `backups/${fileName}`;
    const content = btoa(JSON.stringify(backupData, null, 2));

    // Check if file exists
    const checkUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    const checkResponse = await fetch(checkUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    let sha: string | undefined;
    if (checkResponse.ok) {
      const existingFile = await checkResponse.json();
      sha = existingFile.sha;
    }

    // Create or update file
    const createUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    const createResponse = await fetch(createUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Backup - ${new Date().toISOString()}`,
        content,
        ...(sha && { sha }),
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error('GitHub API error:', error);
      throw new Error(`GitHub API error: ${error}`);
    }

    const result = await createResponse.json();

    // Log backup
    const { error: logError } = await supabase
      .from('backup_logs')
      .insert({
        workspace_id: workspaceId,
        backup_type: 'github',
        status: 'completed',
        file_path: result.content.html_url,
      });

    if (logError) {
      console.error('Error logging backup:', logError);
    }

    // Update last backup time
    await supabase
      .from('backup_schedules')
      .update({ 
        last_backup_at: new Date().toISOString(),
        next_backup_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('workspace_id', workspaceId)
      .eq('backup_type', 'github');

    return new Response(
      JSON.stringify({
        success: true,
        backup_url: result.content.html_url,
        timestamp: new Date().toISOString(),
        total_links: links?.length || 0,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in github-backup function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: 'Backup failed', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});