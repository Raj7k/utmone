import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PerformanceData {
  score: number;
  confidence: number;
  insights: string[];
  historicalCTR?: number;
  benchmarkCTR?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workspace_id, utm_source, utm_medium, utm_campaign } = await req.json();

    if (!workspace_id) {
      return new Response(
        JSON.stringify({ error: 'workspace_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch historical click data for this workspace
    const { data: clickData, error: clickError } = await supabase
      .from('link_clicks')
      .select(`
        id,
        link_id,
        links!inner(
          utm_source,
          utm_medium,
          utm_campaign,
          workspace_id
        )
      `)
      .eq('links.workspace_id', workspace_id)
      .gte('clicked_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()) // Last 90 days
      .limit(5000);

    if (clickError) {
      console.error('Error fetching click data:', clickError);
    }

    // Calculate performance metrics
    const insights: string[] = [];
    let score = 50; // Base score
    let confidence = 0.3; // Low confidence if no data

    // Group clicks by source/medium combo
    const comboPerformance: Record<string, { clicks: number; links: Set<string> }> = {};
    
    if (clickData && clickData.length > 0) {
      confidence = Math.min(0.9, 0.3 + (clickData.length / 1000) * 0.6);
      
      clickData.forEach((click: any) => {
        const source = click.links?.utm_source || 'direct';
        const medium = click.links?.utm_medium || 'none';
        const key = `${source}|${medium}`;
        
        if (!comboPerformance[key]) {
          comboPerformance[key] = { clicks: 0, links: new Set() };
        }
        comboPerformance[key].clicks++;
        comboPerformance[key].links.add(click.link_id);
      });
    }

    // Calculate average CTR per combo
    const comboStats: Record<string, number> = {};
    Object.entries(comboPerformance).forEach(([key, data]) => {
      comboStats[key] = data.clicks / data.links.size; // Average clicks per link
    });

    // Find best performing combos
    const sortedCombos = Object.entries(comboStats)
      .sort(([, a], [, b]) => b - a);

    const currentComboKey = `${utm_source || 'direct'}|${utm_medium || 'none'}`;
    const currentComboStats = comboStats[currentComboKey];
    
    if (sortedCombos.length > 0) {
      const topCombo = sortedCombos[0];
      const avgPerformance = Object.values(comboStats).reduce((a, b) => a + b, 0) / Object.values(comboStats).length;
      
      if (currentComboStats) {
        // We have data for this exact combo
        const percentile = (currentComboStats / topCombo[1]) * 100;
        score = Math.min(95, Math.max(30, 50 + (percentile - 50)));
        
        if (currentComboStats > avgPerformance * 1.2) {
          insights.push(`${utm_source}/${utm_medium} performs 20%+ above average in your workspace`);
        } else if (currentComboStats < avgPerformance * 0.8) {
          const [bestSource, bestMedium] = topCombo[0].split('|');
          insights.push(`consider ${bestSource}/${bestMedium} — it performs ${Math.round((topCombo[1] / avgPerformance - 1) * 100)}% better`);
        }
      } else if (utm_source && utm_medium) {
        // No data for this combo, check similar
        const similarSource = Object.keys(comboStats).find(k => k.startsWith(utm_source + '|'));
        const similarMedium = Object.keys(comboStats).find(k => k.endsWith('|' + utm_medium));
        
        if (similarSource) {
          insights.push(`${utm_source} source has worked well with other mediums`);
          score += 10;
        }
        if (similarMedium) {
          insights.push(`${utm_medium} medium shows good performance historically`);
          score += 10;
        }
      }
    }

    // Industry benchmark insights
    const standardMediums = ['cpc', 'email', 'social', 'organic', 'referral', 'newsletter'];
    if (utm_medium && standardMediums.includes(utm_medium.toLowerCase())) {
      score += 5;
      if (utm_medium.toLowerCase() === 'email' || utm_medium.toLowerCase() === 'newsletter') {
        insights.push('email campaigns typically see 2-3x higher engagement than social');
      }
    }

    // Campaign naming insights
    if (utm_campaign) {
      const hasDate = /\d{4}|\d{2}-\d{2}|q[1-4]/i.test(utm_campaign);
      if (hasDate) {
        score += 5;
        insights.push('date-tagged campaigns are easier to analyze');
      }
    }

    // Cap score at 95
    score = Math.min(95, Math.max(20, score));

    const response: PerformanceData = {
      score: Math.round(score),
      confidence: Math.round(confidence * 100) / 100,
      insights: insights.slice(0, 3), // Max 3 insights
      historicalCTR: currentComboStats ? Math.round(currentComboStats * 100) / 100 : undefined,
      benchmarkCTR: sortedCombos.length > 0 ? Math.round(sortedCombos[0][1] * 100) / 100 : undefined,
    };

    console.log('Performance prediction:', response);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in predict-link-performance:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
