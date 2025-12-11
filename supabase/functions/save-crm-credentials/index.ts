import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  workspace_id: string;
  provider: string;
  api_key: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY') || 'default-encryption-key';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: RequestBody = await req.json();
    const { workspace_id, provider, api_key } = body;

    if (!workspace_id || !provider || !api_key) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user has access to workspace
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspace_id)
      .eq('user_id', user.id)
      .single();

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('owner_id')
      .eq('id', workspace_id)
      .single();

    if (!membership && workspace?.owner_id !== user.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Test the connection before saving (provider-specific)
    const testResult = await testCRMConnection(provider, api_key);
    if (!testResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: testResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Encrypt the API key using pgcrypto
    const { data: encryptedData, error: encryptError } = await supabase.rpc(
      'encrypt_sensitive_data',
      { plaintext: api_key, encryption_key: encryptionKey }
    );

    if (encryptError) {
      console.error('Encryption error:', encryptError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to encrypt credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert integration record
    const { error: upsertError } = await supabase
      .from('integrations')
      .upsert({
        workspace_id,
        provider,
        access_token_encrypted: encryptedData,
        is_active: true,
        created_by: user.id,
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'workspace_id,provider',
      });

    if (upsertError) {
      console.error('Upsert error:', upsertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save integration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`CRM integration saved: ${provider} for workspace ${workspace_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        provider,
        message: `${provider} connected successfully` 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in save-crm-credentials:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function testCRMConnection(provider: string, apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    switch (provider) {
      case 'hubspot': {
        const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (response.status === 401) {
          return { success: false, error: 'Invalid HubSpot API key' };
        }
        if (!response.ok) {
          return { success: false, error: `HubSpot API error: ${response.status}` };
        }
        return { success: true };
      }

      case 'pipedrive': {
        const response = await fetch(`https://api.pipedrive.com/v1/users/me?api_token=${apiKey}`);
        if (response.status === 401) {
          return { success: false, error: 'Invalid Pipedrive API token' };
        }
        if (!response.ok) {
          return { success: false, error: `Pipedrive API error: ${response.status}` };
        }
        return { success: true };
      }

      case 'zoho': {
        // Zoho requires OAuth refresh - for now just validate format
        if (!apiKey || apiKey.length < 10) {
          return { success: false, error: 'Invalid Zoho credentials format' };
        }
        return { success: true };
      }

      case 'salesforce': {
        // Salesforce requires OAuth - for now just validate format
        if (!apiKey || !apiKey.includes(':')) {
          return { success: false, error: 'Salesforce credentials should be in format: consumer_key:consumer_secret' };
        }
        return { success: true };
      }

      case 'kylas': {
        // Kylas API validation
        if (!apiKey || apiKey.length < 10) {
          return { success: false, error: 'Invalid Kylas API key' };
        }
        return { success: true };
      }

      default:
        return { success: true }; // Unknown provider, allow anyway
    }
  } catch (error) {
    console.error(`Error testing ${provider} connection:`, error);
    return { success: false, error: `Failed to test ${provider} connection` };
  }
}
