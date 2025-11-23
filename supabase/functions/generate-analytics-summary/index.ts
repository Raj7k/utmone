import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { workspace_id } = await req.json();

    if (!workspace_id) {
      throw new Error('workspace_id is required');
    }

    console.log(`[AI Summary] Generating insights for workspace ${workspace_id}`);

    // Check for cached summary (< 24 hours old)
    const { data: cachedInsight } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('workspace_id', workspace_id)
      .eq('insight_type', 'analytics_summary')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (cachedInsight) {
      console.log('[AI Summary] Returning cached insight');
      return new Response(
        JSON.stringify({ summary: cachedInsight.summary_text, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch analytics data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: clicks, error: clicksError } = await supabase
      .from('link_clicks')
      .select('*, links!inner(workspace_id)')
      .eq('links.workspace_id', workspace_id)
      .gte('clicked_at', thirtyDaysAgo.toISOString());

    if (clicksError) throw clicksError;

    if (!clicks || clicks.length === 0) {
      const summary = "you don't have any analytics data yet. start by creating links and sharing them to see insights here.";
      return new Response(
        JSON.stringify({ summary, cached: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate metrics
    const totalClicks = clicks.length;
    const uniqueClicks = new Set(clicks.map(c => `${c.ip_address}-${c.user_agent}`)).size;
    
    const countries = clicks.reduce((acc, c) => {
      if (c.country) {
        acc[c.country] = (acc[c.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const topCountry = Object.entries(countries).sort(([,a], [,b]) => (b as number) - (a as number))[0];

    const devices = clicks.reduce((acc, c) => {
      if (c.device_type) {
        acc[c.device_type] = (acc[c.device_type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const referrers = clicks.reduce((acc, c) => {
      if (c.referrer && c.referrer !== 'direct') {
        acc[c.referrer] = (acc[c.referrer] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topReferrer = Object.entries(referrers).sort(([,a], [,b]) => (b as number) - (a as number))[0];

    // Calculate trend (compare last 7 days vs previous 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentClicks = clicks.filter(c => new Date(c.clicked_at!) >= sevenDaysAgo).length;
    const previousClicks = clicks.filter(c => {
      const date = new Date(c.clicked_at!);
      return date >= fourteenDaysAgo && date < sevenDaysAgo;
    }).length;

    const trendPercent = previousClicks > 0 
      ? Math.round(((recentClicks - previousClicks) / previousClicks) * 100) 
      : 0;

    const trend = trendPercent > 0 ? `up ${trendPercent}%` : trendPercent < 0 ? `down ${Math.abs(trendPercent)}%` : 'stable';

    // Generate AI summary using Lovable AI
    const aiPrompt = `You are an analytics assistant. Analyze this data and provide 3 key insights in natural, conversational language. Be concise and actionable.

Data:
- Total clicks (30 days): ${totalClicks}
- Unique visitors: ${uniqueClicks}
- Top country: ${topCountry ? `${topCountry[0]} (${topCountry[1]} clicks)` : 'N/A'}
- Top referrer: ${topReferrer ? `${topReferrer[0]} (${topReferrer[1]} clicks)` : 'direct'}
- Device breakdown: ${JSON.stringify(devices)}
- Trend (last 7 days vs previous 7 days): ${trend}

Format: 3 bullet points, each under 20 words, lowercase, no emojis. Focus on actionable insights.`;

    console.log('[AI Summary] Calling Lovable AI...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: 'You are a helpful analytics assistant. Provide clear, actionable insights.' },
          { role: 'user', content: aiPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('[AI Summary] Lovable AI error:', errorText);
      throw new Error(`Lovable AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const summary = aiData.choices[0]?.message?.content || 'insights are being generated...';

    console.log('[AI Summary] Generated summary:', summary);

    // Cache the summary
    await supabase.from('ai_insights').insert({
      workspace_id,
      insight_type: 'analytics_summary',
      summary_text: summary,
      metadata: {
        total_clicks: totalClicks,
        unique_clicks: uniqueClicks,
        top_country: topCountry?.[0],
        trend,
      },
    });

    return new Response(
      JSON.stringify({ summary, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[AI Summary] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
