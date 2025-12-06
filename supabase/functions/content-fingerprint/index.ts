import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface FingerprintPayload {
  link_id: string;
  destination_url: string;
  workspace_id: string;
}

// Extract text content from HTML
function extractTextContent(html: string): { title: string; description: string; headings: string[] } {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // Extract h1 and h2 headings
  const headings: string[] = [];
  const h1Matches = html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi);
  const h2Matches = html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi);
  
  for (const match of h1Matches) {
    headings.push(match[1].trim());
  }
  for (const match of h2Matches) {
    headings.push(match[1].trim());
  }

  return { title, description, headings: headings.slice(0, 5) };
}

// Simple keyword extraction without external dependencies
function extractKeywords(text: string): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'that', 'this', 'these', 'those', 'it', 'its', 'you', 'your', 'we', 'our', 'they',
    'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each',
    'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not',
    'only', 'same', 'so', 'than', 'too', 'very', 'can', 'just', 'about', 'into',
  ]);

  // Clean and tokenize
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Count word frequency
  const wordCount = new Map<string, number>();
  for (const word of words) {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  }

  // Sort by frequency and return top keywords
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

// Categorize content based on keywords
function categorizeContent(keywords: string[], title: string, description: string): string[] {
  const categories: Set<string> = new Set();
  const allText = `${title} ${description} ${keywords.join(' ')}`.toLowerCase();

  // Category detection rules
  const categoryRules: Record<string, string[]> = {
    'pricing': ['pricing', 'price', 'cost', 'plan', 'subscription', 'tier', 'package'],
    'case-study': ['case study', 'success story', 'customer story', 'results', 'roi'],
    'product': ['product', 'feature', 'solution', 'platform', 'tool', 'software'],
    'blog': ['blog', 'article', 'post', 'news', 'update', 'announcement'],
    'documentation': ['docs', 'documentation', 'guide', 'tutorial', 'how to', 'api'],
    'security': ['security', 'privacy', 'compliance', 'gdpr', 'soc', 'encryption'],
    'enterprise': ['enterprise', 'business', 'corporate', 'organization', 'team'],
    'developer': ['developer', 'api', 'integration', 'sdk', 'code', 'technical'],
    'marketing': ['marketing', 'campaign', 'analytics', 'tracking', 'attribution'],
    'sales': ['sales', 'demo', 'contact', 'quote', 'consultation'],
    'support': ['support', 'help', 'faq', 'contact us', 'customer service'],
    'about': ['about', 'company', 'team', 'mission', 'story', 'careers'],
    'comparison': ['vs', 'versus', 'compare', 'comparison', 'alternative'],
    'webinar': ['webinar', 'event', 'workshop', 'conference', 'summit'],
    'ebook': ['ebook', 'whitepaper', 'report', 'download', 'resource'],
  };

  for (const [category, terms] of Object.entries(categoryRules)) {
    for (const term of terms) {
      if (allText.includes(term)) {
        categories.add(category);
        break;
      }
    }
  }

  // Add top 2 keywords as additional tags
  const topKeywords = keywords.slice(0, 2);
  for (const kw of topKeywords) {
    if (kw.length > 3 && !categories.has(kw)) {
      categories.add(kw);
    }
  }

  return Array.from(categories).slice(0, 5);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: FingerprintPayload = await req.json();
    const { link_id, destination_url, workspace_id } = payload;

    if (!link_id || !destination_url) {
      return new Response(
        JSON.stringify({ error: 'link_id and destination_url are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[content-fingerprint] Analyzing ${destination_url} for link ${link_id}`);

    // Fetch the destination URL
    let html = '';
    try {
      const response = await fetch(destination_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; utm.one ContentBot/1.0)',
          'Accept': 'text/html',
        },
        redirect: 'follow',
      });

      if (response.ok) {
        html = await response.text();
      } else {
        console.log(`[content-fingerprint] Failed to fetch URL: ${response.status}`);
      }
    } catch (fetchError) {
      console.error('[content-fingerprint] Fetch error:', fetchError);
    }

    let tags: string[] = [];
    let title = '';
    let description = '';

    if (html) {
      // Extract content from HTML
      const extracted = extractTextContent(html);
      title = extracted.title;
      description = extracted.description;

      // Build text for analysis
      const textForAnalysis = `${title} ${description} ${extracted.headings.join(' ')}`;
      
      // Extract keywords
      const keywords = extractKeywords(textForAnalysis);
      
      // Categorize content
      tags = categorizeContent(keywords, title, description);

      console.log(`[content-fingerprint] Extracted tags: ${tags.join(', ')}`);
    }

    // If we couldn't extract tags, try to infer from URL
    if (tags.length === 0) {
      const urlPath = new URL(destination_url).pathname.toLowerCase();
      if (urlPath.includes('blog')) tags.push('blog');
      if (urlPath.includes('pricing')) tags.push('pricing');
      if (urlPath.includes('docs')) tags.push('documentation');
      if (urlPath.includes('case-stud')) tags.push('case-study');
      if (urlPath.includes('product')) tags.push('product');
    }

    // Update the link with content fingerprint
    const { error: updateError } = await supabase
      .from('links')
      .update({
        content_tags: tags,
        content_title: title.slice(0, 255),
        content_description: description.slice(0, 500),
        content_analyzed_at: new Date().toISOString(),
      })
      .eq('id', link_id)
      .eq('workspace_id', workspace_id);

    if (updateError) {
      console.error('[content-fingerprint] Update error:', updateError);
      throw updateError;
    }

    console.log(`[content-fingerprint] Successfully fingerprinted link ${link_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        link_id,
        title,
        description: description.slice(0, 200),
        tags,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[content-fingerprint] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
