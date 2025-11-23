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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    console.log(`[Data Export] Starting export for user ${user.id}`);

    // Create export request
    const { data: exportRequest, error: requestError } = await supabase
      .from('data_export_requests')
      .insert({
        user_id: user.id,
        status: 'processing',
      })
      .select()
      .single();

    if (requestError) throw requestError;

    // Fetch all user data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: workspaces } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', user.id);

    const { data: memberWorkspaces } = await supabase
      .from('workspace_members')
      .select('*, workspaces(*)')
      .eq('user_id', user.id);

    const workspaceIds = [
      ...(workspaces?.map(w => w.id) || []),
      ...(memberWorkspaces?.map(m => m.workspace_id) || [])
    ];

    const { data: links } = await supabase
      .from('links')
      .select('*')
      .in('workspace_id', workspaceIds);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const linkIds = links?.map(l => l.id) || [];
    const { data: clicks } = linkIds.length > 0 
      ? await supabase
          .from('link_clicks')
          .select('*')
          .in('link_id', linkIds)
          .gte('clicked_at', ninetyDaysAgo.toISOString())
      : { data: [] };

    const { data: apiKeys } = await supabase
      .from('api_keys')
      .select('key_name, key_prefix, scopes, created_at, last_used_at')
      .in('workspace_id', workspaceIds);

    // Generate CSV files
    const profileCsv = generateCSV(['email', 'full_name', 'created_at'], [profile]);
    const workspacesCsv = generateCSV(['id', 'name', 'created_at'], workspaces);
    const linksCsv = generateCSV(['title', 'short_url', 'destination_url', 'utm_source', 'utm_medium', 'utm_campaign', 'total_clicks', 'created_at'], links);
    const clicksCsv = generateCSV(['link_id', 'country', 'device_type', 'referrer', 'clicked_at'], clicks);
    const apiKeysCsv = generateCSV(['key_name', 'key_prefix', 'scopes', 'created_at'], apiKeys);

    // Create ZIP (simplified - in production, use JSZip)
    const exportData = {
      profile: profileCsv,
      workspaces: workspacesCsv,
      links: linksCsv,
      clicks: clicksCsv,
      api_keys: apiKeysCsv,
      exported_at: new Date().toISOString(),
    };

    const jsonExport = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonExport], { type: 'application/json' });

    // Upload to Supabase Storage
    const fileName = `user-data-${user.id}-${Date.now()}.json`;
    const serviceRoleClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    
    const { data: uploadData, error: uploadError } = await serviceRoleClient.storage
      .from('exports')
      .upload(fileName, blob, {
        contentType: 'application/json',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL (expires in 7 days)
    const { data: urlData } = await serviceRoleClient.storage
      .from('exports')
      .createSignedUrl(fileName, 7 * 24 * 60 * 60); // 7 days

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Update export request
    await supabase
      .from('data_export_requests')
      .update({
        status: 'completed',
        export_url: urlData?.signedUrl,
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', exportRequest.id);

    console.log(`[Data Export] Export completed for user ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        download_url: urlData?.signedUrl,
        expires_at: expiresAt.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Data Export] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateCSV(headers: string[], data: any[] | null): string {
  if (!data || data.length === 0) return headers.join(',') + '\n';
  
  const rows = data.map(row => 
    headers.map(h => {
      const value = row[h];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}
