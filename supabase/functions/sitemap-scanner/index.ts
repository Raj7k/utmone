import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  priority?: number;
}

interface ScanResult {
  success: boolean;
  bestMatch: string | null;
  similarity: number;
  candidates: Array<{ url: string; score: number }>;
  totalUrls: number;
  error?: string;
}

// Tokenize URL path into meaningful segments
function tokenizePath(url: string): string[] {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    
    // Split by common delimiters and filter empty
    const segments = path
      .split(/[\/\-_\.]+/)
      .filter(s => s.length > 0 && s !== 'html' && s !== 'htm' && s !== 'php');
    
    // Also include query params as tokens
    const params = parsed.searchParams;
    params.forEach((value, key) => {
      if (value) segments.push(value.toLowerCase());
      segments.push(key.toLowerCase());
    });
    
    return segments;
  } catch {
    return [];
  }
}

// Calculate Jaccard similarity between two token sets
function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0;
  
  const setA = new Set(a);
  const setB = new Set(b);
  
  let intersection = 0;
  setA.forEach(item => {
    if (setB.has(item)) intersection++;
  });
  
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// Levenshtein distance for fuzzy string matching
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Normalized Levenshtein similarity (0-1)
function levenshteinSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(a, b) / maxLen;
}

// Combined semantic similarity score
function calculateSimilarity(targetUrl: string, candidateUrl: string): number {
  const targetTokens = tokenizePath(targetUrl);
  const candidateTokens = tokenizePath(candidateUrl);
  
  // Jaccard similarity on tokens (40% weight)
  const jaccard = jaccardSimilarity(targetTokens, candidateTokens);
  
  // Path-level Levenshtein similarity (30% weight)
  try {
    const targetPath = new URL(targetUrl).pathname.toLowerCase();
    const candidatePath = new URL(candidateUrl).pathname.toLowerCase();
    const pathSimilarity = levenshteinSimilarity(targetPath, candidatePath);
    
    // Last segment similarity (30% weight) - often the most meaningful
    const targetLast = targetTokens[targetTokens.length - 1] || '';
    const candidateLast = candidateTokens[candidateTokens.length - 1] || '';
    const lastSegmentSim = levenshteinSimilarity(targetLast, candidateLast);
    
    return (jaccard * 0.4) + (pathSimilarity * 0.3) + (lastSegmentSim * 0.3);
  } catch {
    return jaccard;
  }
}

// Parse sitemap XML to extract URLs
function parseSitemap(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  
  // Match <url> blocks
  const urlRegex = /<url>([\s\S]*?)<\/url>/gi;
  let urlMatch;
  
  while ((urlMatch = urlRegex.exec(xml)) !== null) {
    const urlBlock = urlMatch[1];
    
    // Extract <loc>
    const locMatch = /<loc>(.*?)<\/loc>/i.exec(urlBlock);
    if (locMatch) {
      const entry: SitemapEntry = {
        loc: locMatch[1].trim().replace(/&amp;/g, '&'),
      };
      
      // Extract optional fields
      const lastmodMatch = /<lastmod>(.*?)<\/lastmod>/i.exec(urlBlock);
      if (lastmodMatch) entry.lastmod = lastmodMatch[1].trim();
      
      const priorityMatch = /<priority>(.*?)<\/priority>/i.exec(urlBlock);
      if (priorityMatch) entry.priority = parseFloat(priorityMatch[1]);
      
      entries.push(entry);
    }
  }
  
  // Also check for sitemap index files
  const sitemapIndexRegex = /<sitemap>([\s\S]*?)<\/sitemap>/gi;
  let sitemapMatch;
  
  while ((sitemapMatch = sitemapIndexRegex.exec(xml)) !== null) {
    const sitemapBlock = sitemapMatch[1];
    const locMatch = /<loc>(.*?)<\/loc>/i.exec(sitemapBlock);
    if (locMatch) {
      entries.push({
        loc: locMatch[1].trim().replace(/&amp;/g, '&'),
      });
    }
  }
  
  return entries;
}

// Fetch sitemap with retry and sitemap index support
async function fetchSitemap(sitemapUrl: string, depth = 0): Promise<SitemapEntry[]> {
  if (depth > 2) return []; // Prevent infinite recursion
  
  try {
    const response = await fetch(sitemapUrl, {
      headers: {
        'User-Agent': 'utm.one-sitemap-scanner/1.0',
        'Accept': 'application/xml, text/xml, */*',
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch sitemap: ${response.status}`);
      return [];
    }
    
    const xml = await response.text();
    const entries = parseSitemap(xml);
    
    // Check if this is a sitemap index
    if (xml.includes('<sitemapindex')) {
      console.log(`Found sitemap index with ${entries.length} child sitemaps`);
      
      // Fetch child sitemaps (limit to first 5 for performance)
      const childPromises = entries.slice(0, 5).map(entry => 
        fetchSitemap(entry.loc, depth + 1)
      );
      
      const childResults = await Promise.all(childPromises);
      return childResults.flat();
    }
    
    return entries;
  } catch (error) {
    console.error(`Error fetching sitemap: ${error}`);
    return [];
  }
}

// Find best matching URL from sitemap
function findBestMatch(
  brokenUrl: string, 
  sitemapEntries: SitemapEntry[],
  minSimilarity = 0.3
): { bestMatch: string | null; similarity: number; candidates: Array<{ url: string; score: number }> } {
  
  if (sitemapEntries.length === 0) {
    return { bestMatch: null, similarity: 0, candidates: [] };
  }
  
  // Calculate similarity for all entries
  const scored = sitemapEntries.map(entry => ({
    url: entry.loc,
    score: calculateSimilarity(brokenUrl, entry.loc),
    priority: entry.priority || 0.5,
  }));
  
  // Sort by score (weighted by sitemap priority)
  scored.sort((a, b) => {
    const aWeighted = a.score + (a.priority * 0.1);
    const bWeighted = b.score + (b.priority * 0.1);
    return bWeighted - aWeighted;
  });
  
  // Get top candidates
  const topCandidates = scored.slice(0, 5).map(s => ({
    url: s.url,
    score: Math.round(s.score * 100) / 100,
  }));
  
  const best = scored[0];
  
  // Only return if above minimum similarity threshold
  if (best && best.score >= minSimilarity) {
    return {
      bestMatch: best.url,
      similarity: Math.round(best.score * 100) / 100,
      candidates: topCandidates,
    };
  }
  
  return {
    bestMatch: null,
    similarity: best?.score || 0,
    candidates: topCandidates,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brokenUrl, sitemapUrl, domainUrl, minSimilarity = 0.3 } = await req.json();
    
    if (!brokenUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "brokenUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Determine sitemap URL
    let targetSitemapUrl = sitemapUrl;
    if (!targetSitemapUrl && domainUrl) {
      // Try common sitemap locations
      const domain = domainUrl.replace(/\/$/, '');
      targetSitemapUrl = `${domain}/sitemap.xml`;
    }
    
    if (!targetSitemapUrl) {
      // Extract domain from broken URL
      try {
        const parsed = new URL(brokenUrl);
        targetSitemapUrl = `${parsed.origin}/sitemap.xml`;
      } catch {
        return new Response(
          JSON.stringify({ success: false, error: "Could not determine sitemap URL" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    console.log(`Scanning sitemap: ${targetSitemapUrl} for recovery of: ${brokenUrl}`);
    
    // Fetch and parse sitemap
    const entries = await fetchSitemap(targetSitemapUrl);
    
    if (entries.length === 0) {
      // Try alternate sitemap locations
      const alternateUrls = [
        targetSitemapUrl.replace('/sitemap.xml', '/sitemap_index.xml'),
        targetSitemapUrl.replace('/sitemap.xml', '/sitemap-index.xml'),
        targetSitemapUrl.replace('/sitemap.xml', '/sitemaps/sitemap.xml'),
      ];
      
      for (const altUrl of alternateUrls) {
        const altEntries = await fetchSitemap(altUrl);
        if (altEntries.length > 0) {
          console.log(`Found sitemap at alternate location: ${altUrl}`);
          const result = findBestMatch(brokenUrl, altEntries, minSimilarity);
          
          return new Response(
            JSON.stringify({
              success: result.bestMatch !== null,
              bestMatch: result.bestMatch,
              similarity: result.similarity,
              candidates: result.candidates,
              totalUrls: altEntries.length,
              sitemapUrl: altUrl,
            } as ScanResult),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          bestMatch: null,
          similarity: 0,
          candidates: [],
          totalUrls: 0,
          error: "No sitemap found or sitemap is empty",
        } as ScanResult),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Found ${entries.length} URLs in sitemap`);
    
    // Find best match
    const result = findBestMatch(brokenUrl, entries, minSimilarity);
    
    const response: ScanResult = {
      success: result.bestMatch !== null,
      bestMatch: result.bestMatch,
      similarity: result.similarity,
      candidates: result.candidates,
      totalUrls: entries.length,
    };
    
    console.log(`Best match: ${result.bestMatch} (similarity: ${result.similarity})`);
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Sitemap scanner error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        bestMatch: null,
        similarity: 0,
        candidates: [],
        totalUrls: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      } as ScanResult),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
