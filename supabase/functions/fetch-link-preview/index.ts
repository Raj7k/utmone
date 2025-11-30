import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from '../_shared/security-headers.ts';
import { ApiError, ErrorCode, handleEdgeFunctionError } from '../_shared/error-handler.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkId, destinationUrl } = await req.json();

    if (!linkId || !destinationUrl) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'linkId and destinationUrl are required'
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first - delete stale entries with null metadata
    const { data: cached } = await supabase
      .from('link_previews')
      .select('*')
      .eq('link_id', linkId)
      .gt('expires_at', new Date().toISOString())
      .single();

    // If cached but has no metadata, delete and refetch
    if (cached && !cached.page_title && !cached.favicon_url) {
      await supabase.from('link_previews').delete().eq('link_id', linkId);
    } else if (cached) {
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
      // Browser-like headers to avoid bot detection
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(destinationUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();

        // Extract title - try OG title first, then page title
        const ogTitleMatch = html.match(/<meta[^>]*(?:property|name)=["'](?:og:title|twitter:title)["'][^>]*content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:title|twitter:title)["']/i);
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        
        if (ogTitleMatch) {
          pageTitle = ogTitleMatch[1].trim();
        } else if (titleMatch) {
          pageTitle = titleMatch[1].trim();
        }

        // Extract OG image - try multiple patterns
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                           html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
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

        // Fallback favicon sources
        if (!faviconUrl) {
          const parsedUrl = new URL(destinationUrl);
          faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;
        }
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      
      // Even on error, provide fallback favicon
      try {
        const parsedUrl = new URL(destinationUrl);
        faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;
      } catch (e) {
        console.error('Error parsing URL for fallback favicon:', e);
      }
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
    return handleEdgeFunctionError(error);
  }
});
