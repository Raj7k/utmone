import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LinkRecord {
  id: string;
  destination_url: string;
  status: string;
  expires_at: string | null;
  max_clicks: number | null;
  total_clicks: number;
  fallback_url: string | null;
  title: string | null;
  password: string | null;
  domain: string | null;
  slug: string | null;
  workspace_id: string;
  geo_targets: Record<string, string> | null;
  created_by: string | null;
}

// Parse user agent to extract device, browser, and OS info
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  let deviceType = 'desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    deviceType = 'tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    deviceType = 'mobile';
  }
  
  let browser = 'unknown';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';
  
  let os = 'unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os x')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  return { deviceType, browser, os };
}

// Check if click is unique (IP + user agent in last 24 hours)
async function isUniqueClick(supabase: any, linkId: string, ipAddress: string, userAgent: string): Promise<boolean> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('link_clicks')
    .select('id')
    .eq('link_id', linkId)
    .eq('ip_address', ipAddress)
    .eq('user_agent', userAgent)
    .gte('clicked_at', twentyFourHoursAgo)
    .limit(1);
  
  if (error) {
    console.error('Error checking unique click:', error);
    return true;
  }
  
  return data.length === 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const allPathParts = url.pathname.split('/').filter(Boolean);
    
    // Skip the first segment which is the function name ("redirect")
    const pathParts = allPathParts.slice(1);
    
    if (pathParts.length === 0) {
      return new Response('Invalid URL format - no slug', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }
    
    // We only support domain/slug format now (no path column)
    const slug = pathParts[pathParts.length - 1];
    
    // Get domain from header or hostname
    let domain = req.headers.get('X-Original-Domain') || url.hostname;
    domain = domain.replace(/^www\./, '');
    
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                      req.headers.get('x-real-ip') || 
                      '127.0.0.1';
    
    console.log(`Redirect request: domain=${domain}, slug=${slug}, ip=${ipAddress}`);
    
    // Look up the link using actual schema columns
    const { data: link, error: linkError } = await supabase
      .from('links')
      // PERF: include campaign_id so we can pass it through to link_clicks
      // insert below. This lets the BEFORE-INSERT trigger skip its SELECT
      // because NEW.campaign_id is no longer NULL — saves ~40ms per click.
      .select('id, destination_url, status, expires_at, max_clicks, total_clicks, fallback_url, title, password, domain, slug, workspace_id, campaign_id, geo_targets, created_by')
      .eq('domain', domain)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    
    if (linkError || !link) {
      // Also check public_short_links table as fallback
      const { data: publicLink, error: publicError } = await supabase
        .from('public_short_links')
        .select('id, destination_url, slug')
        .eq('slug', slug)
        .single();
      
      if (!publicError && publicLink) {
        // Update click count
        await supabase
          .from('public_short_links')
          .update({ clicks: publicLink.clicks + 1 })
          .eq('id', publicLink.id);
        
        return Response.redirect(publicLink.destination_url, 302);
      }
      
      console.error('Link not found:', linkError);
      return new Response('Link not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }
    
    const linkRecord = link as unknown as LinkRecord;
    
    // Check if link has password protection
    if (linkRecord.password) {
      console.log('Link is password protected - redirecting to password page');
      const passwordPageUrl = `https://utmone.lovable.app/password-protected?link=${linkRecord.id}`;
      return Response.redirect(passwordPageUrl, 302);
    }
    
    // Check if link is paused or archived
    if (linkRecord.status === 'paused' || linkRecord.status === 'archived') {
      return new Response('Link not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }
    
    // Check expiration by date
    if (linkRecord.expires_at) {
      const expiryDate = new Date(linkRecord.expires_at);
      if (expiryDate < new Date()) {
        console.log('Link expired by date');
        if (linkRecord.fallback_url) {
          return Response.redirect(linkRecord.fallback_url, 302);
        }
        return new Response(
          `<!DOCTYPE html><html><head><title>Link Expired</title></head>
          <body style="font-family:system-ui;text-align:center;padding:50px;">
          <h1>Link Expired</h1><p>This link has expired.</p></body></html>`,
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
        );
      }
    }
    
    // Check expiration by max clicks
    if (linkRecord.max_clicks && linkRecord.total_clicks >= linkRecord.max_clicks) {
      console.log('Link expired by max clicks');
      if (linkRecord.fallback_url) {
        return Response.redirect(linkRecord.fallback_url, 302);
      }
      return new Response(
        `<!DOCTYPE html><html><head><title>Link Expired</title></head>
        <body style="font-family:system-ui;text-align:center;padding:50px;">
        <h1>Link Expired</h1><p>This link has reached its click limit.</p></body></html>`,
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
      );
    }
    
    // Extract request metadata
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const referrer = req.headers.get('referer') || req.headers.get('referrer') || null;
    const { deviceType, browser, os } = parseUserAgent(userAgent);
    
    const cfCountry = req.headers.get('cf-ipcountry') || req.headers.get('CF-IPCountry');
    const cfCity = req.headers.get('cf-ipcity') || req.headers.get('CF-IPCity');
    const country = cfCountry || 'unknown';
    const city = cfCity || 'unknown';

    let finalRedirectUrl = linkRecord.destination_url;

    // Check geo_targets
    if (linkRecord.geo_targets && Object.keys(linkRecord.geo_targets).length > 0) {
      const geoTargetUrl = linkRecord.geo_targets[country];
      if (geoTargetUrl) {
        finalRedirectUrl = geoTargetUrl;
        console.log(`Geo-targeting matched: ${country} -> ${geoTargetUrl}`);
      }
    }
    
    // Check if unique click
    const isUnique = await isUniqueClick(supabase, linkRecord.id, ipAddress, userAgent);
    
    // Log click for analytics (background)
    const logClick = async () => {
      const clickData = {
        link_id: linkRecord.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer,
        device_type: deviceType,
        browser: browser,
        os: os,
        is_unique: isUnique,
        clicked_at: new Date().toISOString(),
        country: country,
        city: city,
        workspace_id: linkRecord.workspace_id,
        // PERF: populate denormalized fields up-front so the BEFORE-INSERT
        // triggers (set_click_workspace_id, set_click_campaign_id) early-exit
        // on their NULL check instead of running SELECT link.workspace_id /
        // SELECT link.campaign_id on every INSERT.
        campaign_id: (linkRecord as any).campaign_id ?? null,
      };

      try {
        const { error: insertError } = await supabase.from('link_clicks').insert(clickData);
        if (insertError) {
          console.error('Click insert error:', insertError.message);
        }
      } catch (error) {
        console.error('Error logging click:', error);
      }
    };
    
    // Fire and forget
    logClick().catch(console.error);
    
    // SECURITY: do NOT log the full destination URL. Destination URLs can
    // contain sensitive query params (OAuth codes, magic-link tokens, email
    // addresses, session IDs). Log only the slug/host for correlation.
    try {
      const destHost = new URL(finalRedirectUrl).host;
      console.log(`Redirecting slug=${slug} domain=${domain} -> host=${destHost} (302)`);
    } catch {
      console.log(`Redirecting slug=${slug} domain=${domain} (302)`);
    }
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': finalRedirectUrl,
        ...corsHeaders,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });

  } catch (error) {
    console.error('Redirect error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/html' }
    });
  }
});
