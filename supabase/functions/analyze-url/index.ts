import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, regenerate = false, previousSuggestions = [] } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing URL:', url);

    // Step 1: Fetch page metadata
    let pageTitle = '';
    let pageDescription = '';
    let pageContent = '';
    
    try {
      const pageResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; utm.one/1.0; +https://utm.one)',
        },
      });
      
      if (pageResponse.ok) {
        const html = await pageResponse.text();
        
        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) pageTitle = titleMatch[1].trim();
        
        // Extract meta description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        if (descMatch) pageDescription = descMatch[1].trim();
        
        // Extract h1
        const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        if (h1Match) pageContent = h1Match[1].trim();
        
        // Extract OG title if no title found
        if (!pageTitle) {
          const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
          if (ogTitleMatch) pageTitle = ogTitleMatch[1].trim();
        }
      }
    } catch (fetchError) {
      console.log('Could not fetch page metadata:', fetchError);
    }

    // Parse URL for additional context
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    const urlContext = pathParts.join(' ').replace(/-/g, ' ');
    
    // Enhanced source/medium detection from URL
    const hostname = parsedUrl.hostname.toLowerCase();
    const detectedSource = detectSourceFromUrl(hostname, parsedUrl.href);
    const detectedMedium = detectMediumFromUrl(hostname, pathParts);

    // Step 2: Call LLM for semantic analysis
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      // Fallback to rule-based suggestions if no API key
      console.log('No LOVABLE_API_KEY, using rule-based suggestions');
      return new Response(
        JSON.stringify(generateRuleBasedSuggestions(url, pageTitle, urlContext)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build regeneration context if this is a retry
    const regenerationContext = regenerate && previousSuggestions.length > 0
      ? `\n\nIMPORTANT: The user didn't like the previous suggestions. Generate COMPLETELY DIFFERENT suggestions.
Previous suggestions to AVOID (do NOT repeat any of these):
- UTM campaigns: ${previousSuggestions.filter((s: string) => s.includes('campaign:')).map((s: string) => s.replace('campaign:', '')).join(', ') || 'none'}
- UTM content: ${previousSuggestions.filter((s: string) => s.includes('content:')).map((s: string) => s.replace('content:', '')).join(', ') || 'none'}
- UTM terms: ${previousSuggestions.filter((s: string) => s.includes('term:')).map((s: string) => s.replace('term:', '')).join(', ') || 'none'}
- Vanity slugs: ${previousSuggestions.filter((s: string) => s.includes('slug:')).map((s: string) => s.replace('slug:', '')).join(', ') || 'none'}

Be MORE creative this time. Use different angles, synonyms, or alternative interpretations of the content.`
      : '';

    const prompt = `Analyze this URL and its page content to suggest UTM parameters and vanity slugs for a marketing campaign.

URL: ${url}
Page Title: ${pageTitle || 'Not available'}
Page Description: ${pageDescription || 'Not available'}
Page H1: ${pageContent || 'Not available'}
URL Path Context: ${urlContext || 'None'}${regenerationContext}

Based on this context, provide:
1. A suggested utm_campaign name (lowercase, hyphenated, short, descriptive)
2. A suggested utm_content tag (lowercase, hyphenated, describes the content type)
3. A suggested utm_term keyword (lowercase, hyphenated, primary keyword)
4. 3 creative vanity slug suggestions (short, memorable, 3-12 chars each)
5. A brief context description (what type of page/content this is)

Respond in JSON format only:
{
  "utm_campaign": "campaign-name",
  "utm_content": "content-tag",
  "utm_term": "keyword",
  "vanity_slugs": ["slug1", "slug2", "slug3"],
  "context": "Brief description of page type"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert marketing analyst. Extract campaign insights from URLs and page content. Always respond with valid JSON only, no markdown.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      // Fallback to rule-based
      return new Response(
        JSON.stringify(generateRuleBasedSuggestions(url, pageTitle, urlContext)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;
    
    if (!content) {
      return new Response(
        JSON.stringify(generateRuleBasedSuggestions(url, pageTitle, urlContext)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse AI response
    try {
      // Clean up potential markdown formatting
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const suggestions = JSON.parse(cleanedContent);
      
      console.log('AI suggestions:', suggestions);
      
      return new Response(
        JSON.stringify({
          success: true,
          ai_powered: true,
          suggestions: {
            utm_campaign: sanitizeSlug(suggestions.utm_campaign || ''),
            utm_content: sanitizeSlug(suggestions.utm_content || ''),
            utm_term: sanitizeSlug(suggestions.utm_term || ''),
            utm_source: detectedSource,
            utm_medium: detectedMedium,
            vanity_slugs: (suggestions.vanity_slugs || []).map(sanitizeSlug).filter(Boolean),
            context: suggestions.context || '',
          },
          metadata: {
            page_title: pageTitle,
            page_description: pageDescription,
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, content);
      return new Response(
        JSON.stringify(generateRuleBasedSuggestions(url, pageTitle, urlContext)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in analyze-url:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);
}

// Source detection from URL/referrer patterns
function detectSourceFromUrl(hostname: string, fullUrl: string): string {
  const sourceMap: Record<string, string> = {
    'twitter.com': 'twitter',
    'x.com': 'twitter',
    'facebook.com': 'facebook',
    'fb.com': 'facebook',
    'linkedin.com': 'linkedin',
    'instagram.com': 'instagram',
    'youtube.com': 'youtube',
    'youtu.be': 'youtube',
    'tiktok.com': 'tiktok',
    'pinterest.com': 'pinterest',
    'reddit.com': 'reddit',
    'medium.com': 'medium',
    'substack.com': 'substack',
    'github.com': 'github',
    'producthunt.com': 'producthunt',
    'news.ycombinator.com': 'hackernews',
  };
  
  for (const [domain, source] of Object.entries(sourceMap)) {
    if (hostname.includes(domain)) {
      return source;
    }
  }
  
  return '';
}

// Medium detection from URL patterns
function detectMediumFromUrl(hostname: string, pathParts: string[]): string {
  const pathStr = pathParts.join('/').toLowerCase();
  
  // Social platforms
  const socialDomains = ['twitter.com', 'x.com', 'facebook.com', 'linkedin.com', 'instagram.com', 'tiktok.com', 'pinterest.com'];
  if (socialDomains.some(d => hostname.includes(d))) {
    return 'social';
  }
  
  // Blog/content patterns
  if (pathStr.includes('blog') || pathStr.includes('article') || pathStr.includes('post')) {
    return 'content';
  }
  
  // Email patterns
  if (pathStr.includes('newsletter') || pathStr.includes('email') || pathStr.includes('subscribe')) {
    return 'email';
  }
  
  // Paid patterns
  if (pathStr.includes('ad') || pathStr.includes('promo') || pathStr.includes('sponsored')) {
    return 'cpc';
  }
  
  // Video patterns
  if (hostname.includes('youtube') || hostname.includes('vimeo') || pathStr.includes('video')) {
    return 'video';
  }
  
  return '';
}

function generateRuleBasedSuggestions(url: string, pageTitle: string, urlContext: string) {
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace('www.', '');
  const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
  
  // Detect source and medium
  const detectedSource = detectSourceFromUrl(hostname, url);
  const detectedMedium = detectMediumFromUrl(hostname, pathParts);
  
  // Extract meaningful parts
  const lastPath = pathParts[pathParts.length - 1] || '';
  const cleanPath = lastPath.replace(/-/g, ' ').replace(/_/g, ' ');
  
  // Generate campaign name from path or title
  const campaignBase = cleanPath || pageTitle || hostname;
  const utm_campaign = sanitizeSlug(campaignBase.slice(0, 30));
  
  // Generate content tag
  const utm_content = pathParts.length > 1 ? sanitizeSlug(pathParts[0]) : 'page';
  
  // Generate term from keywords
  const words = (cleanPath + ' ' + pageTitle).toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const utm_term = sanitizeSlug(words[0] || 'promo');
  
  // Generate vanity slugs
  const vanity_slugs = [
    sanitizeSlug(lastPath.slice(0, 12)) || 'link',
    sanitizeSlug(words.slice(0, 2).join('-')) || 'promo',
    Math.random().toString(36).substring(2, 8),
  ].filter(s => s.length >= 3);
  
  return {
    success: true,
    ai_powered: false,
    suggestions: {
      utm_campaign,
      utm_content,
      utm_term,
      utm_source: detectedSource,
      utm_medium: detectedMedium,
      vanity_slugs,
      context: `Page from ${hostname}`,
    },
    metadata: {
      page_title: pageTitle,
      page_description: '',
    }
  };
}
