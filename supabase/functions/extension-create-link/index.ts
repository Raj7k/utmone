import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate random slug
function generateSlug(length = 7): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Build UTM URL
function buildUtmUrl(baseUrl: string, utmParams: Record<string, string>): string {
  try {
    const url = new URL(baseUrl);
    for (const [key, value] of Object.entries(utmParams)) {
      if (value && value.trim()) {
        url.searchParams.set(key, value.trim().toLowerCase().replace(/\s+/g, '_'));
      }
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const apiKey = authHeader.replace('Bearer ', '');
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Validate API key and get workspace
    const keyHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(apiKey)
    );
    const hashArray = Array.from(new Uint8Array(keyHash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const { data: apiKeyData, error: keyError } = await supabase
      .from('api_keys')
      .select('workspace_id, scopes, is_active')
      .eq('key_hash', hashHex)
      .single();
    
    if (keyError || !apiKeyData) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!apiKeyData.is_active) {
      return new Response(
        JSON.stringify({ error: 'API key is inactive' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check scopes (need 'links:write' or 'all')
    const scopes = apiKeyData.scopes || [];
    if (!scopes.includes('all') && !scopes.includes('links:write')) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions. Need links:write scope.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Update last used
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('key_hash', hashHex);
    
    // Parse request body
    const body = await req.json();
    const {
      original_url,
      title,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      custom_slug
    } = body;
    
    if (!original_url) {
      return new Response(
        JSON.stringify({ error: 'original_url is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate URL
    try {
      new URL(original_url);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get primary domain for workspace
    const { data: domain } = await supabase
      .from('domains')
      .select('domain')
      .eq('workspace_id', apiKeyData.workspace_id)
      .eq('is_primary', true)
      .eq('is_verified', true)
      .single();
    
    const shortDomain = domain?.domain || 'utm.one';
    
    // Generate or validate slug
    let slug = custom_slug || generateSlug();
    
    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('links')
      .select('id')
      .eq('short_code', slug)
      .eq('workspace_id', apiKeyData.workspace_id)
      .single();
    
    if (existing) {
      if (custom_slug) {
        return new Response(
          JSON.stringify({ error: 'This slug is already in use' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // Generate new slug if collision
      slug = generateSlug();
    }
    
    // Build destination URL with UTM params
    const utmParams: Record<string, string> = {};
    if (utm_source) utmParams.utm_source = utm_source;
    if (utm_medium) utmParams.utm_medium = utm_medium;
    if (utm_campaign) utmParams.utm_campaign = utm_campaign;
    if (utm_term) utmParams.utm_term = utm_term;
    if (utm_content) utmParams.utm_content = utm_content;
    
    const destinationUrl = Object.keys(utmParams).length > 0 
      ? buildUtmUrl(original_url, utmParams)
      : original_url;
    
    // Create link
    const { data: link, error: linkError } = await supabase
      .from('links')
      .insert({
        workspace_id: apiKeyData.workspace_id,
        original_url: destinationUrl,
        short_code: slug,
        domain: shortDomain,
        title: title || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_term: utm_term || null,
        utm_content: utm_content || null,
        created_by: null, // Extension doesn't have user context
        status: 'active'
      })
      .select()
      .single();
    
    if (linkError) {
      console.error('Error creating link:', linkError);
      return new Response(
        JSON.stringify({ error: 'Failed to create link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const shortUrl = `https://${shortDomain}/${slug}`;
    
    return new Response(
      JSON.stringify({
        id: link.id,
        short_url: shortUrl,
        short_code: slug,
        original_url: destinationUrl,
        title: link.title,
        utm_source: link.utm_source,
        utm_medium: link.utm_medium,
        utm_campaign: link.utm_campaign,
        created_at: link.created_at
      }),
      { 
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Extension create link error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
