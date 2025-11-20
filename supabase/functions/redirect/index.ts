import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LinkRecord {
  id: string;
  final_url: string;
  status: string;
  expires_at: string | null;
  max_clicks: number | null;
  total_clicks: number;
  fallback_url: string | null;
  custom_expiry_message: string | null;
  redirect_type: string;
  title: string;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
}

// Parse user agent to extract device, browser, and OS info
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Device detection
  let deviceType = 'desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    deviceType = 'tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    deviceType = 'mobile';
  }
  
  // Browser detection
  let browser = 'unknown';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';
  else if (ua.includes('trident') || ua.includes('msie')) browser = 'Internet Explorer';
  
  // OS detection
  let os = 'unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os x')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  return { deviceType, browser, os };
}

// Get geolocation from IP using ipapi.co (free tier: 1000 requests/day)
async function getGeolocation(ip: string) {
  try {
    // Skip geolocation for localhost/private IPs
    if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1') {
      return { country: null, city: null };
    }
    
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'Keka URL Shortener' }
    });
    
    if (!response.ok) {
      console.warn(`Geolocation API error for IP ${ip}: ${response.status}`);
      return { country: null, city: null };
    }
    
    const data = await response.json();
    return {
      country: data.country_name || null,
      city: data.city || null
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    return { country: null, city: null };
  }
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
    return true; // Default to unique if error
  }
  
  return data.length === 0;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Extract path and slug from URL
    // Expected format: /:path/:slug (e.g., /go/abc123)
    if (pathParts.length !== 2) {
      return new Response('Invalid URL format', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }
    
    const [path, slug] = pathParts;
    let domain = url.hostname;
    
    // Normalize domain (remove www if present)
    domain = domain.replace(/^www\./, '');
    
    console.log(`Redirect request: domain=${domain}, path=${path}, slug=${slug}`);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify domain is registered and verified
    console.log(`Checking domain verification for: ${domain}`);
    const { data: domainRecord, error: domainError } = await supabase
      .from('domains')
      .select('is_verified, workspace_id')
      .eq('domain', domain)
      .eq('is_verified', true)
      .single();

    if (domainError || !domainRecord) {
      console.log(`Domain not verified: ${domain}`, domainError);
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head><title>Domain Not Configured</title></head>
          <body style="font-family: system-ui; text-align: center; padding: 50px;">
            <h1>Domain Not Configured</h1>
            <p>This domain is not set up for short links.</p>
            <p style="color: #666; font-size: 14px;">Domain: ${domain}</p>
          </body>
        </html>`,
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' }
        }
      );
    }
    
    console.log(`Domain verified for workspace: ${domainRecord.workspace_id}`);
    
    // Look up the link
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('id, final_url, status, expires_at, max_clicks, total_clicks, fallback_url, custom_expiry_message, redirect_type, title, og_title, og_description, og_image')
      .eq('domain', domain)
      .eq('path', path)
      .eq('slug', slug)
      .single();
    
    if (linkError || !link) {
      console.error('Link not found:', linkError);
      return new Response('Link not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }
    
    const linkRecord = link as LinkRecord;
    
    // Check if link is paused
    if (linkRecord.status === 'paused') {
      return new Response(
        `<html><body><h1>Link Paused</h1><p>This link has been temporarily paused.</p></body></html>`,
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' }
        }
      );
    }
    
    // Check if link is archived
    if (linkRecord.status === 'archived') {
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
        const message = linkRecord.custom_expiry_message || 'This link has expired.';
        return new Response(
          `<html><body><h1>Link Expired</h1><p>${message}</p></body></html>`,
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'text/html' }
          }
        );
      }
    }
    
    // Check expiration by max clicks
    if (linkRecord.max_clicks && linkRecord.total_clicks >= linkRecord.max_clicks) {
      console.log('Link expired by max clicks');
      if (linkRecord.fallback_url) {
        return Response.redirect(linkRecord.fallback_url, 302);
      }
      const message = linkRecord.custom_expiry_message || 'This link has expired.';
      return new Response(
        `<html><body><h1>Link Expired</h1><p>${message}</p></body></html>`,
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' }
        }
      );
    }
    
    // Extract request metadata
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                      req.headers.get('x-real-ip') || 
                      '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const referrer = req.headers.get('referer') || req.headers.get('referrer') || null;
    
    // Parse user agent
    const { deviceType, browser, os } = parseUserAgent(userAgent);
    
    // Get geolocation (async, but we'll await it)
    const { country, city } = await getGeolocation(ipAddress);
    
    // Check if unique click
    const isUnique = await isUniqueClick(supabase, linkRecord.id, ipAddress, userAgent);
    
    console.log(`Click details: device=${deviceType}, browser=${browser}, os=${os}, country=${country}, unique=${isUnique}`);
    
    // Log the click (fire and forget using waitUntil for performance)
    const logClick = async () => {
      const { error: clickError } = await supabase
        .from('link_clicks')
        .insert({
          link_id: linkRecord.id,
          ip_address: ipAddress,
          user_agent: userAgent,
          referrer: referrer,
          device_type: deviceType,
          browser: browser,
          os: os,
          country: country,
          city: city,
          is_unique: isUnique,
          clicked_at: new Date().toISOString()
        });
      
      if (clickError) {
        console.error('Error logging click:', clickError);
      }
      
      // Update link statistics
      const { error: updateError } = await supabase
        .from('links')
        .update({
          total_clicks: linkRecord.total_clicks + 1,
          unique_clicks: isUnique ? (await supabase.from('links').select('unique_clicks').eq('id', linkRecord.id).single()).data?.unique_clicks + 1 : undefined,
          last_clicked_at: new Date().toISOString()
        })
        .eq('id', linkRecord.id);
      
      if (updateError) {
        console.error('Error updating link stats:', updateError);
      }
    };
    
    // Start background task for click logging
    // @ts-ignore - waitUntil is available in Deno Deploy
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(logClick());
    } else {
      // Fallback for local development
      logClick().catch(console.error);
    }
    
    // Check if this is a social media crawler (serve OG tags) or a regular user (redirect)
    const isCrawler = /bot|crawler|spider|facebook|twitter|linkedin|whatsapp|slack|telegram/i.test(userAgent);
    
    if (isCrawler && (linkRecord.og_title || linkRecord.og_description || linkRecord.og_image)) {
      // Serve HTML with Open Graph tags for social media crawlers
      const ogTitle = linkRecord.og_title || linkRecord.title;
      const ogDescription = linkRecord.og_description || 'Click to visit this link';
      const ogImage = linkRecord.og_image || '';
      const shortUrl = `https://${domain}/${path}/${slug}`;
      
      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta property="og:title" content="${ogTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${ogDescription.replace(/"/g, '&quot;')}" />
    ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ''}
    <meta property="og:url" content="${shortUrl}" />
    <meta property="og:type" content="website" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${ogDescription.replace(/"/g, '&quot;')}" />
    ${ogImage ? `<meta name="twitter:image" content="${ogImage}" />` : ''}
    
    <meta http-equiv="refresh" content="0;url=${linkRecord.final_url}" />
    <title>${ogTitle}</title>
  </head>
  <body>
    <p>Redirecting to <a href="${linkRecord.final_url}">${linkRecord.final_url}</a>...</p>
    <script>window.location.href = "${linkRecord.final_url}";</script>
  </body>
</html>`;
      
      return new Response(html, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }
    
    // Perform redirect for regular users
    const redirectStatus = linkRecord.redirect_type === '301' ? 301 : 302;
    console.log(`Redirecting to: ${linkRecord.final_url} with status ${redirectStatus}`);
    
    return Response.redirect(linkRecord.final_url, redirectStatus);
    
  } catch (error) {
    console.error('Redirect error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
});
