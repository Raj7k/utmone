import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const RATE_LIMIT = {
  maxRequests: 10, // 10 links per hour
  windowSeconds: 3600,
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get IP address for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown';

    // Initialize Supabase with service role (bypass RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check rate limit using public rate limit function
    const { data: rateLimitOk } = await supabase
      .rpc('check_rate_limit', {
        p_ip_address: ip,
        p_endpoint: 'create-public-link',
        p_max_requests: RATE_LIMIT.maxRequests,
        p_window_minutes: RATE_LIMIT.windowSeconds / 60,
      });

    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ 
          error: 'rate limit exceeded. please try again later.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429 
        }
      );
    }

    // Parse request body
    const { url, slug: customSlug } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'url is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Validate URL format and length
    if (typeof url !== 'string' || url.length > 2048) {
      return new Response(
        JSON.stringify({ error: 'url too long (max 2048 characters)' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    try {
      const parsedUrl = new URL(url);
      
      // Block localhost and private IPs
      if (parsedUrl.hostname === 'localhost' || 
          parsedUrl.hostname.startsWith('127.') ||
          parsedUrl.hostname.startsWith('192.168.') ||
          parsedUrl.hostname.startsWith('10.') ||
          parsedUrl.hostname.startsWith('172.')) {
        return new Response(
          JSON.stringify({ error: 'private urls are not allowed' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }

      // Only allow http/https
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return new Response(
          JSON.stringify({ error: 'only http and https urls are allowed' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
    } catch {
      return new Response(
        JSON.stringify({ error: 'invalid url format' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Generate random slug (8 characters)
    const generateSlug = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let slug = '';
      for (let i = 0; i < 8; i++) {
        slug += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return slug;
    };

    let slug = customSlug || generateSlug();
    let attempts = 0;
    const maxAttempts = 5;

    // Ensure slug is unique
    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from('links')
        .select('id')
        .eq('domain', 'utm.click')
        .eq('slug', slug)
        .maybeSingle();

      if (!existing) break;
      
      slug = generateSlug();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return new Response(
        JSON.stringify({ error: 'could not generate unique slug. please try again.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Get system workspace ID for public links
    // Query for ANY existing workspace to use (preferably the oldest one)
    const { data: systemWorkspace } = await supabase
      .from('workspaces')
      .select('id, owner_id')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!systemWorkspace) {
      // No workspaces exist yet - return error
      console.error('❌ No workspaces available for public link creation');
      return new Response(
        JSON.stringify({ 
          error: 'public link creation not available yet. please sign up for full features.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503 
        }
      );
    }

    // Create link using the workspace's owner as creator.
    // Note: the links table on this DB does not have a `path` column — omit
    // it or the insert fails with PGRST204. short_url is a generated column
    // so we must NOT try to insert it either.
    const { data: link, error: linkError } = await supabase
      .from('links')
      .insert({
        workspace_id: systemWorkspace.id,
        domain: 'utm.click',
        slug: slug,
        destination_url: url,
        final_url: url,
        title: `Public Link ${slug}`,
        status: 'active',
        created_by: systemWorkspace.owner_id,
      })
      .select()
      .single();

    if (linkError) throw linkError;

    // Get the auto-generated short_url from the returned link
    const shortUrl = link.short_url;

    console.log(`✅ Created public link: ${shortUrl} → ${url} (IP: ${ip})`);

    return new Response(
      JSON.stringify({ 
        short_url: shortUrl,
        slug: slug,
        destination_url: url,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error creating public link:', error);
    const errorMessage = error instanceof Error ? error.message : 'unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
