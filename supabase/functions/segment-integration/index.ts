import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to encrypt token
async function encryptToken(plaintext: string): Promise<string> {
  const encryptionKey = Deno.env.get('ENCRYPTION_KEY')!;
  const encoder = new TextEncoder();
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(encryptionKey.padEnd(32, '0').slice(0, 32)),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    keyMaterial,
    encoder.encode(plaintext)
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

// Helper function to decrypt token
async function decryptToken(ciphertext: string): Promise<string> {
  const encryptionKey = Deno.env.get('ENCRYPTION_KEY')!;
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(encryptionKey.padEnd(32, '0').slice(0, 32)),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    keyMaterial,
    encryptedData
  );

  return decoder.decode(decrypted);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { action, clickId, writeKey } = await req.json();

    // Get user's workspace
    const { data: workspaceData } = await supabaseClient
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .single();

    if (!workspaceData) {
      throw new Error('No workspace found');
    }

    const workspaceId = workspaceData.workspace_id;

    if (action === 'configure') {
      // Encrypt write key before storing
      const encryptedConfig = await encryptToken(JSON.stringify({ write_key: writeKey }));

      // Store encrypted config
      await supabaseClient
        .from('integrations')
        .upsert({
          workspace_id: workspaceId,
          provider: 'segment',
          config_encrypted: encryptedConfig,
          is_active: true,
          created_by: user.id,
        });

      console.log('Segment integration configured for workspace:', workspaceId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'track-click') {
      // Get integration with encrypted config
      const { data: integration } = await supabaseClient
        .from('integrations')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('provider', 'segment')
        .eq('is_active', true)
        .single();

      if (!integration) {
        throw new Error('Segment integration not found');
      }

      // Decrypt config
      const configJson = await decryptToken(integration.config_encrypted);
      const config = JSON.parse(configJson);
      const segmentWriteKey = config.write_key;

      // Get click data
      const { data: click } = await supabaseClient
        .from('link_clicks')
        .select('*, links(*)')
        .eq('id', clickId)
        .single();

      if (!click) {
        throw new Error('Click not found');
      }

      // Send track event to Segment
      const segmentEvent = {
        userId: click.ip_address, // Or actual user ID if available
        event: 'Link Clicked',
        properties: {
          link_id: click.link_id,
          link_title: click.links.title,
          short_url: click.links.short_url,
          destination_url: click.links.destination_url,
          utm_source: click.links.utm_source,
          utm_medium: click.links.utm_medium,
          utm_campaign: click.links.utm_campaign,
          device_type: click.device_type,
          browser: click.browser,
          os: click.os,
          country: click.country,
          city: click.city,
          referrer: click.referrer,
          is_unique: click.is_unique,
        },
        timestamp: click.clicked_at,
      };

      const segmentResponse = await fetch('https://api.segment.io/v1/track', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(segmentWriteKey + ':')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(segmentEvent),
      });

      if (!segmentResponse.ok) {
        throw new Error(`Segment API error: ${segmentResponse.statusText}`);
      }

      console.log('Click tracked to Segment:', clickId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in segment-integration:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
