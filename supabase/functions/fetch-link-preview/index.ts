import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkId, destinationUrl } = await req.json();

    if (!linkId || !destinationUrl) {
      return new Response(
        JSON.stringify({ error: 'linkId and destinationUrl are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first
    const { data: cached } = await supabase
      .from('link_previews')
      .select('*')
      .eq('link_id', linkId)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cached) {
      return new Response(
        JSON.stringify(cached),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch page metadata
    let pageTitle = '';
    let faviconUrl = '';
    let ogImageUrl = '';
    let isSslSecure = destinationUrl.startsWith('https://');

    try {
      const response = await fetch(destinationUrl, {
        headers: { 'User-Agent': 'utm.one-preview-bot/1.0' },
      });

      if (response.ok) {
        const html = await response.text();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) pageTitle = titleMatch[1].trim();

        // Extract OG image
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        if (ogImageMatch) ogImageUrl = ogImageMatch[1];

        // Extract favicon
        const faviconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i);
        if (faviconMatch) {
          faviconUrl = faviconMatch[1];
          if (!faviconUrl.startsWith('http')) {
            const url = new URL(destinationUrl);
            faviconUrl = `${url.protocol}//${url.host}${faviconUrl.startsWith('/') ? '' : '/'}${faviconUrl}`;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    }

    // Check security scan results
    const { data: link } = await supabase
      .from('links')
      .select('security_status')
      .eq('id', linkId)
      .single();

    const isSafe = link?.security_status === 'safe' || link?.security_status === 'not_scanned';
    const threats = link?.security_status === 'threats_detected' ? ['detected'] : [];

    // Store in cache
    const previewData = {
      link_id: linkId,
      destination_url: destinationUrl,
      page_title: pageTitle || null,
      favicon_url: faviconUrl || null,
      og_image_url: ogImageUrl || null,
      is_ssl_secure: isSslSecure,
      is_safe: isSafe,
      threats,
    };

    const { data: saved, error: saveError } = await supabase
      .from('link_previews')
      .upsert(previewData, { onConflict: 'link_id' })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving preview:', saveError);
    }

    return new Response(
      JSON.stringify(saved || previewData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Link preview error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
