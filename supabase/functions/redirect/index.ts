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

interface OGVariant {
  id: string;
  variant_name: string;
  og_title: string | null;
  og_description: string | null;
  og_image: string;
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

// Rate limiting using Deno KV
async function checkRateLimit(kv: Deno.Kv, ip: string): Promise<boolean> {
  const key = ['ratelimit', ip];
  const now = Date.now();
  const windowMs = 60000; // 1 minute window
  const maxRequests = 100;
  
  // Get current count
  const result = await kv.get<{ count: number; resetAt: number }>(key);
  
  if (!result.value) {
    // First request in window
    await kv.set(key, { count: 1, resetAt: now + windowMs }, { expireIn: windowMs });
    return true;
  }
  
  // Check if window expired
  if (now > result.value.resetAt) {
    // Reset window
    await kv.set(key, { count: 1, resetAt: now + windowMs }, { expireIn: windowMs });
    return true;
  }
  
  // Check if over limit
  if (result.value.count >= maxRequests) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return false;
  }
  
  // Increment count
  await kv.set(key, { 
    count: result.value.count + 1, 
    resetAt: result.value.resetAt 
  }, { expireIn: Math.max(0, result.value.resetAt - now) });
  
  return true;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = performance.now();

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Extract path and slug from URL
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
    
    // Extract IP address for rate limiting
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                      req.headers.get('x-real-ip') || 
                      '127.0.0.1';
    
    // Rate limiting check using Deno KV
    const kv = await Deno.openKv();
    const rateLimitOk = await checkRateLimit(kv, ipAddress);
    
    if (!rateLimitOk) {
      return new Response('Too many requests. Please try again later.', {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain',
          'Retry-After': '60'
        }
      });
    }
    
    console.log(`Redirect request: domain=${domain}, path=${path}, slug=${slug}, ip=${ipAddress}`);
    
    // Try cache first using Deno KV
    const cacheKey = ['link', domain, path, slug];
    const cached = await kv.get<LinkRecord>(cacheKey);
    
    let linkRecord: LinkRecord;
    let fromCache = false;
    
    if (cached.value) {
      linkRecord = cached.value;
      fromCache = true;
      console.log(`Cache hit for ${domain}/${path}/${slug}`);
    } else {
      // Cache miss - fetch from database
      console.log(`Cache miss for ${domain}/${path}/${slug} - querying database`);
      
      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Verify domain is registered and verified
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
      
      // Look up the link (now using optimized index)
      const { data: link, error: linkError } = await supabase
        .from('links')
        .select('id, final_url, status, expires_at, max_clicks, total_clicks, fallback_url, custom_expiry_message, redirect_type, title, og_title, og_description, og_image')
        .eq('domain', domain)
        .eq('path', path)
        .eq('slug', slug)
        .eq('status', 'active') // Filter by status to use partial index
        .single();
      
      if (linkError || !link) {
        console.error('Link not found:', linkError);
        return new Response('Link not found', { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' }
        });
      }
      
      linkRecord = link as LinkRecord;
      
      // Cache the link for 5 minutes
      await kv.set(cacheKey, linkRecord, { expireIn: 300000 }); // 5 minutes in ms
    }
    
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
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const referrer = req.headers.get('referer') || req.headers.get('referrer') || null;
    
    // Parse user agent
    const { deviceType, browser, os } = parseUserAgent(userAgent);
    
    // Check if unique click (only if not from cache, to avoid redundant DB query)
    let isUnique = true;
    if (!fromCache) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      isUnique = await isUniqueClick(supabase, linkRecord.id, ipAddress, userAgent);
    }
    
    console.log(`Click details: device=${deviceType}, browser=${browser}, os=${os}, unique=${isUnique}, cache=${fromCache}`);
    
    // Log the click (background task - DOES NOT await geolocation)
    const logClick = async () => {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Insert click WITHOUT geolocation data (will be processed by background job)
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
          country: null, // Will be filled by background geolocation processor
          city: null,    // Will be filled by background geolocation processor
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
      
      // Invalidate cache when link is updated
      await kv.delete(['link', domain, path, slug]);
    };
    
    // Start background task for click logging with variant tracking
    const logClickWithVariant = async () => {
      await logClick();
      
      // Check if this is a social media crawler for variant tracking
      const isCrawler = /bot|crawler|spider|facebook|twitter|linkedin|whatsapp|slack|telegram/i.test(userAgent);
      
      if (isCrawler) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Fetch active OG variants for A/B testing
        const { data: variants, error: variantsError } = await supabase
          .from('og_image_variants')
          .select('id, variant_name, og_title, og_description, og_image')
          .eq('link_id', linkRecord.id)
          .eq('is_active', true);
        
        if (!variantsError && variants && variants.length > 0) {
          // Randomly select a variant for A/B testing
          const selectedVariant = variants[Math.floor(Math.random() * variants.length)] as OGVariant;
          
          // Track the variant selection
          const { error: variantTrackError } = await supabase
            .from('link_clicks')
            .update({ og_variant_id: selectedVariant.id })
            .eq('link_id', linkRecord.id)
            .eq('ip_address', ipAddress)
            .eq('user_agent', userAgent)
            .order('clicked_at', { ascending: false })
            .limit(1);
          
          if (variantTrackError) {
            console.error('Error tracking variant:', variantTrackError);
          }
        }
      }
    };
    
    // Start background task for click logging
    // @ts-ignore - waitUntil is available in Deno Deploy
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(logClickWithVariant());
    } else {
      // Fallback for local development
      logClickWithVariant().catch(console.error);
    }
    
    // Check if this is a social media crawler (serve OG tags) or a regular user (redirect)
    const isCrawler = /bot|crawler|spider|facebook|twitter|linkedin|whatsapp|slack|telegram/i.test(userAgent);
    
    if (isCrawler) {
      // For crawlers, we need to fetch variants from DB (can't use cached link record for this)
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: variants, error: variantsError } = await supabase
        .from('og_image_variants')
        .select('id, variant_name, og_title, og_description, og_image')
        .eq('link_id', linkRecord.id)
        .eq('is_active', true);
      
      let selectedVariant: OGVariant | null = null;
      if (!variantsError && variants && variants.length > 0) {
        selectedVariant = variants[Math.floor(Math.random() * variants.length)] as OGVariant;
      }
      
      // Determine OG tags (variant or default)
      const ogTitle = selectedVariant?.og_title || linkRecord.og_title || linkRecord.title;
      const ogDescription = selectedVariant?.og_description || linkRecord.og_description || 'Click to visit this link';
      const ogImage = selectedVariant?.og_image || linkRecord.og_image || '';
      const shortUrl = `https://${domain}/${path}/${slug}`;
      
      if (ogTitle || ogDescription || ogImage) {
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
    }
    
    // Perform redirect for regular users
    const redirectStatus = linkRecord.redirect_type === '301' ? 301 : 302;
    const endTime = performance.now();
    console.log(`Redirecting to: ${linkRecord.final_url} (${redirectStatus}) - Total time: ${(endTime - startTime).toFixed(2)}ms (cache: ${fromCache})`);
    
    return Response.redirect(linkRecord.final_url, redirectStatus);
    
  } catch (error) {
    console.error('Redirect error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
});
