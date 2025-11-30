import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { getSecureCorsHeaders } from '../_shared/security-headers.ts';
import { ApiError, ErrorCode, handleEdgeFunctionError } from '../_shared/error-handler.ts';

const corsHeaders = getSecureCorsHeaders();

interface LinkRecord {
  id: string;
  final_url: string;
  status: string;
  approval_status: string | null;
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
  password_hash: string | null;
  password_hint: string | null;
  domain: string;
  path: string;
  slug: string;
  workspace_id: string;
  geo_targets: Record<string, string> | null;
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

// Evaluate targeting rules for geo/device-based redirects
async function evaluateTargetingRules(
  supabase: any,
  linkId: string,
  country: string,
  deviceType: string,
  os: string,
  browser: string,
  language: string
): Promise<string | null> {
  const { data: rules, error } = await supabase
    .from('targeting_rules')
    .select('*')
    .eq('link_id', linkId)
    .eq('is_active', true)
    .order('priority', { ascending: false });

  if (error || !rules || rules.length === 0) {
    return null;
  }

  for (const rule of rules) {
    let matches = false;
    const value = rule.value;

    switch (rule.rule_type) {
      case 'country':
        matches = evaluateCondition(country, rule.condition, value);
        break;
      case 'device':
        matches = evaluateCondition(deviceType, rule.condition, value);
        break;
      case 'os':
        matches = evaluateCondition(os, rule.condition, value);
        break;
      case 'browser':
        matches = evaluateCondition(browser, rule.condition, value);
        break;
      case 'language':
        matches = evaluateCondition(language, rule.condition, value);
        break;
    }

    if (matches) {
      console.log(`Targeting rule matched: ${rule.rule_name}, redirecting to: ${rule.redirect_url}`);
      return rule.redirect_url;
    }
  }

  return null;
}

function evaluateCondition(actual: string, condition: string, expected: string[]): boolean {
  switch (condition) {
    case 'equals':
    case 'in':
      return expected.includes(actual);
    case 'not_in':
      return !expected.includes(actual);
    case 'contains':
      return expected.some(val => actual.toLowerCase().includes(val.toLowerCase()));
    default:
      return false;
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

  const startTime = performance.now();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load feature flags from database (no caching)
    let flags: Record<string, boolean> = {};
    const { data: flagsData } = await supabase.from('feature_flags').select('flag_key, is_enabled');
    if (flagsData) {
      flags = Object.fromEntries(flagsData.map(f => [f.flag_key, f.is_enabled]));
    }

    // Check maintenance mode FIRST
    if (flags['maintenance_mode']) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Maintenance - utm.one</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb; }
            .container { text-align: center; padding: 2rem; }
            h1 { font-size: 2rem; margin-bottom: 1rem; color: #1f2937; }
            p { color: #6b7280; margin: 0.5rem 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚧 scheduled maintenance</h1>
            <p>utm.one is currently undergoing scheduled maintenance.</p>
            <p>we'll be back shortly. thank you for your patience.</p>
          </div>
        </body>
        </html>`,
        { 
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'text/html', 'Retry-After': '300' }
        }
      );
    }

    const url = new URL(req.url);
    const allPathParts = url.pathname.split('/').filter(Boolean);
    
    // Skip the first segment which is the function name ("redirect")
    const pathParts = allPathParts.slice(1);
    
    // Extract path and slug from URL
    // Support both formats: domain/slug OR domain/path/slug
    let path: string;
    let slug: string;
    
    if (pathParts.length === 0) {
      // No slug provided - root request
      return new Response('Invalid URL format - no slug', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    } else if (pathParts.length === 1) {
      // Format: domain/slug (assume default path)
      path = '';
      slug = pathParts[0];
    } else if (pathParts.length === 2) {
      // Format: domain/path/slug
      path = pathParts[0];
      slug = pathParts[1];
    } else {
      console.error(`Invalid URL format: ${pathParts.length} parts`, pathParts);
      return new Response('Invalid URL format', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }
    
    // Get domain from X-Original-Domain header (set by Cloudflare Worker) or url.hostname
    let domain = req.headers.get('X-Original-Domain') || url.hostname;
    
    // Normalize domain (remove www if present)
    domain = domain.replace(/^www\./, '');
    
    // Extract IP address for analytics
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                      req.headers.get('x-real-ip') || 
                      '127.0.0.1';
    
    console.log(`Redirect request: domain=${domain}, path=${path}, slug=${slug}, ip=${ipAddress}`);
    
    // Fetch link from database (no caching)
    console.log(`Querying database for ${domain}/${path}/${slug}`);
    
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
      .select('id, final_url, status, approval_status, expires_at, max_clicks, total_clicks, fallback_url, custom_expiry_message, redirect_type, title, og_title, og_description, og_image, password_hash, password_hint, domain, path, slug, workspace_id, geo_targets')
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
    
    const linkRecord = link as LinkRecord;
    
    // Check approval status BEFORE any other checks
    if (linkRecord.approval_status === 'pending') {
      const pendingHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Pending Approval - utm.one</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f9fafb; }
            .container { text-align: center; padding: 2rem; max-width: 500px; }
            .icon { font-size: 64px; margin-bottom: 1rem; }
            h1 { font-size: 2rem; margin-bottom: 1rem; color: #1f2937; font-weight: 600; }
            p { color: #6b7280; margin: 0.5rem 0; line-height: 1.6; }
            .footer { margin-top: 3rem; font-size: 0.875rem; color: #9ca3af; }
            .footer a { color: #217BF4; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">⏳</div>
            <h1>Link Pending Approval</h1>
            <p>This link is awaiting review by an administrator and is not yet active.</p>
            <p>Please check back later or contact the link creator.</p>
            <div class="footer">
              <p>Links powered by <a href="https://utm.one">utm.one</a></p>
            </div>
          </div>
        </body>
        </html>
      `;
      return new Response(pendingHtml, { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }

    if (linkRecord.approval_status === 'rejected') {
      return new Response('Link not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }
    
    // Check if link has password protection
    if (linkRecord.password_hash) {
      console.log('Link is password protected - redirecting to password page');
      const passwordPageUrl = `${Deno.env.get('SUPABASE_URL')}/password-protected?link=${linkRecord.id}&hint=${encodeURIComponent(linkRecord.password_hint || '')}`;
      return Response.redirect(passwordPageUrl, 302);
    }
    
    // Fetch workspace branding for error pages
    const { data: branding } = await supabase
      .from('workspace_branding')
      .select('*')
      .eq('workspace_id', linkRecord.workspace_id)
      .single();
    
    // Check if link is paused
    if (linkRecord.status === 'paused') {
      const brandedHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Paused</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh; 
              margin: 0; 
              background: #f9fafb; 
            }
            .container { 
              text-align: center; 
              padding: 2rem;
              max-width: 500px;
            }
            .logo { 
              height: 48px; 
              margin-bottom: 2rem; 
            }
            .icon { 
              width: 96px; 
              height: 96px; 
              margin: 0 auto 2rem; 
              border-radius: 50%; 
              background: #f3f4f6; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              font-size: 48px;
            }
            h1 { 
              font-size: 2rem; 
              margin-bottom: 1rem; 
              color: #1f2937; 
            }
            p { 
              color: #6b7280; 
              margin: 0.5rem 0; 
              line-height: 1.6;
            }
            .footer { 
              margin-top: 3rem; 
              font-size: 0.875rem; 
              color: #9ca3af; 
            }
            .footer a { 
              color: ${branding?.primary_color || '#217BF4'}; 
              text-decoration: none; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${branding?.logo_url ? `<img src="${branding.logo_url}" alt="${branding.company_name || 'Company'}" class="logo">` : ''}
            <div class="icon" style="color: ${branding?.primary_color || '#217BF4'}">⏸️</div>
            <h1>Link Paused</h1>
            <p>This link has been temporarily paused and is not currently active.</p>
            ${!branding?.hide_branding ? `
              <div class="footer">
                <p>Links powered by <a href="https://utm.one">utm.one</a></p>
              </div>
            ` : ''}
          </div>
        </body>
        </html>
      `;
      
      return new Response(brandedHtml, { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
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
        
        const brandedHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Link Expired</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh; 
                margin: 0; 
                background: #f9fafb; 
              }
              .container { 
                text-align: center; 
                padding: 2rem;
                max-width: 500px;
              }
              .logo { 
                height: 48px; 
                margin-bottom: 2rem; 
              }
              .icon { 
                width: 96px; 
                height: 96px; 
                margin: 0 auto 2rem; 
                border-radius: 50%; 
                background: #f3f4f6; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                font-size: 48px;
              }
              h1 { 
                font-size: 2rem; 
                margin-bottom: 1rem; 
                color: #1f2937; 
              }
              p { 
                color: #6b7280; 
                margin: 0.5rem 0; 
                line-height: 1.6;
              }
              .footer { 
                margin-top: 3rem; 
                font-size: 0.875rem; 
                color: #9ca3af; 
              }
              .footer a { 
                color: ${branding?.primary_color || '#217BF4'}; 
                text-decoration: none; 
              }
            </style>
          </head>
          <body>
            <div class="container">
              ${branding?.logo_url ? `<img src="${branding.logo_url}" alt="${branding.company_name || 'Company'}" class="logo">` : ''}
              <div class="icon" style="color: ${branding?.primary_color || '#217BF4'}">⚠️</div>
              <h1>Link Expired</h1>
              <p>${message}</p>
              ${!branding?.hide_branding ? `
                <div class="footer">
                  <p>Links powered by <a href="https://utm.one">utm.one</a></p>
                </div>
              ` : ''}
            </div>
          </body>
          </html>
        `;
        
        return new Response(brandedHtml, { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' }
        });
      }
    }
    
    // Check expiration by max clicks
    if (linkRecord.max_clicks && linkRecord.total_clicks >= linkRecord.max_clicks) {
      console.log('Link expired by max clicks');
      if (linkRecord.fallback_url) {
        return Response.redirect(linkRecord.fallback_url, 302);
      }
      const message = linkRecord.custom_expiry_message || 'This link has expired.';
      
      const brandedHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Expired</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh; 
              margin: 0; 
              background: #f9fafb; 
            }
            .container { 
              text-align: center; 
              padding: 2rem;
              max-width: 500px;
            }
            .logo { 
              height: 48px; 
              margin-bottom: 2rem; 
            }
            .icon { 
              width: 96px; 
              height: 96px; 
              margin: 0 auto 2rem; 
              border-radius: 50%; 
              background: #f3f4f6; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              font-size: 48px;
            }
            h1 { 
              font-size: 2rem; 
              margin-bottom: 1rem; 
              color: #1f2937; 
            }
            p { 
              color: #6b7280; 
              margin: 0.5rem 0; 
              line-height: 1.6;
            }
            .footer { 
              margin-top: 3rem; 
              font-size: 0.875rem; 
              color: #9ca3af; 
            }
            .footer a { 
              color: ${branding?.primary_color || '#217BF4'}; 
              text-decoration: none; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${branding?.logo_url ? `<img src="${branding.logo_url}" alt="${branding.company_name || 'Company'}" class="logo">` : ''}
            <div class="icon" style="color: ${branding?.primary_color || '#217BF4'}">⚠️</div>
            <h1>Link Expired</h1>
            <p>${message}</p>
            ${!branding?.hide_branding ? `
              <div class="footer">
                <p>Links powered by <a href="https://utm.one">utm.one</a></p>
              </div>
            ` : ''}
          </div>
        </body>
        </html>
      `;
      
      return new Response(brandedHtml, { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }
    
    // Extract request metadata
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const referrer = req.headers.get('referer') || req.headers.get('referrer') || null;
    
    // Get or generate visitor_id from cookie
    const cookieHeader = req.headers.get('cookie') || '';
    let visitorId = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('utm_visitor_id='))
      ?.split('=')[1];
    
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      console.log(`Generated new visitor_id: ${visitorId}`);
    } else {
      console.log(`Existing visitor_id: ${visitorId}`);
    }
    
    // Parse user agent
    const { deviceType, browser, os } = parseUserAgent(userAgent);
    
    // Parse Accept-Language header
    const acceptLanguage = req.headers.get('accept-language') || '';
    const language = acceptLanguage.split(',')[0].split('-')[0] || 'en'; // e.g., "en-US,en" → "en"
    
    // Extract Cloudflare geolocation headers (passed from Cloudflare Worker/DNS)
    // These headers are set by Cloudflare and provide instant geolocation without API calls
    const cfCountry = req.headers.get('cf-ipcountry') || req.headers.get('CF-IPCountry');
    const cfCity = req.headers.get('cf-ipcity') || req.headers.get('CF-IPCity');
    
    // Use Cloudflare headers if available, fallback to 'unknown'
    const country = cfCountry || 'unknown';
    const city = cfCity || 'unknown';
    
    console.log(`Cloudflare geolocation: country=${country}, city=${city}`);

    // Step 1: Check geo_targets first (simple JSON lookup)
    let finalRedirectUrl = linkRecord.final_url;
    let triggeredRule = 'default';
    
    if (linkRecord.geo_targets && Object.keys(linkRecord.geo_targets).length > 0) {
      const geoTargetUrl = linkRecord.geo_targets[country];
      if (geoTargetUrl) {
        finalRedirectUrl = geoTargetUrl;
        triggeredRule = country;
        console.log(`Geo-targeting matched: ${country} -> ${geoTargetUrl}`);
      }
    }
    
    // Step 2: If no geo match, evaluate advanced targeting rules
    if (triggeredRule === 'default') {
      const targetedUrl = await evaluateTargetingRules(
        supabase, 
        linkRecord.id, 
        country, 
        deviceType, 
        os, 
        browser,
        language
      );
      
      if (targetedUrl) {
        finalRedirectUrl = targetedUrl;
        triggeredRule = 'targeting_rule';
      }
    }
    
    // Check if unique click
    const isUnique = await isUniqueClick(supabase, linkRecord.id, ipAddress, userAgent);
    
    console.log(`Click details: device=${deviceType}, browser=${browser}, os=${os}, unique=${isUnique}`);
    
    // Log click for analytics (if tracking enabled)
    const logClick = async () => {
      // Skip if click tracking is disabled
      if (flags['enable_click_tracking'] === false) {
        console.log('Click tracking disabled by feature flag');
        return;
      }

      // Extract QR code ID from query params if present
      const qrCodeId = url.searchParams.get('qr') || null;
      
      // Extract click hour (0-23) for "Best Time to Post" analytics
      const clickedAt = new Date();
      const clickHour = clickedAt.getUTCHours();
      
      const clickData = {
        link_id: linkRecord.id,
        visitor_id: visitorId,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer,
        device_type: deviceType,
        browser: browser,
        os: os,
        is_unique: isUnique,
        qr_code_id: qrCodeId,
        og_variant_id: null,
        clicked_at: clickedAt.toISOString(),
        country: country,
        city: city,
        click_hour: clickHour,
        metadata: { triggered_rule: triggeredRule },
      };

      try {
        // Direct insert to database
        await supabase.from('link_clicks').insert(clickData);
        console.log('Click logged directly');
      } catch (error) {
        console.error('Error logging click:', error);
      }
    };
    
    // Start background task for click logging
    const logClickWithVariant = async () => {
      await logClick();
      
      // Trigger click webhook (async, don't block redirect)
      supabase.functions.invoke('trigger-click-webhook', {
        body: {
          linkId: linkRecord.id,
          clickData: {
            clicked_at: new Date().toISOString(),
            device_type: deviceType,
            country: country,
            referrer: referrer,
          },
        },
      }).catch(err => console.error('Webhook trigger failed:', err));
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
    
    if (isCrawler && flags['enable_og_preview'] !== false) {
      // For crawlers, fetch variants from DB for A/B testing
      let selectedVariant: OGVariant | null = null;
      if (flags['enable_ab_testing'] !== false) {
        const { data: variants, error: variantsError } = await supabase
          .from('og_image_variants')
          .select('id, variant_name, og_title, og_description, og_image')
          .eq('link_id', linkRecord.id)
          .eq('is_active', true);
        
        if (!variantsError && variants && variants.length > 0) {
          selectedVariant = variants[Math.floor(Math.random() * variants.length)] as OGVariant;
        }
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
    console.log(`Redirecting to: ${finalRedirectUrl} (${redirectStatus}) - Total time: ${(endTime - startTime).toFixed(2)}ms`);
    
    // Set visitor_id cookie for conversion tracking (30 days)
    const cookieValue = `utm_visitor_id=${visitorId}; Path=/; Max-Age=2592000; SameSite=Lax; Secure`;
    
    return new Response(null, {
      status: redirectStatus,
      headers: {
        'Location': finalRedirectUrl,
        'Set-Cookie': cookieValue,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
    
  } catch (error) {
    console.error('Redirect error:', error);
    return handleEdgeFunctionError(error);
  }
});
