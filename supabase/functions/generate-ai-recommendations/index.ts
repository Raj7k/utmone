import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all workspaces
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspaces')
      .select('id');

    if (workspacesError) throw workspacesError;

    for (const workspace of workspaces || []) {
      // Get workspace stats
      const { data: links } = await supabase
        .from('links')
        .select('id, total_clicks, created_at')
        .eq('workspace_id', workspace.id);

      if (!links || links.length === 0) continue;

      const linkIds = links.map(l => l.id);
      const totalClicks = links.reduce((sum, l) => sum + (l.total_clicks || 0), 0);

      // Get recent clicks (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentClicks } = await supabase
        .from('link_clicks')
        .select('clicked_at, link_id')
        .in('link_id', linkIds)
        .gte('clicked_at', sevenDaysAgo.toISOString());

      const recentClickCount = recentClicks?.length || 0;

      // Generate recommendations based on patterns
      const recommendations = [];

      // Hot Opportunity: High recent activity
      if (recentClickCount > 100) {
        recommendations.push({
          workspace_id: workspace.id,
          recommendation_type: 'opportunity',
          title: 'your traffic is surging',
          description: `you've received ${recentClickCount} clicks in the last 7 days. consider creating similar campaigns to capitalize on this momentum.`,
          action_url: '/links',
          action_label: 'create similar link',
        });
      }

      // Warning: No recent activity
      if (links.length > 5 && recentClickCount === 0) {
        recommendations.push({
          workspace_id: workspace.id,
          recommendation_type: 'warning',
          title: 'no recent clicks detected',
          description: `your links haven't received clicks in 7 days. consider promoting your campaigns or reviewing your targeting.`,
          action_url: '/analytics',
          action_label: 'view analytics',
        });
      }

      // Suggestion: Create QR codes
      const { data: qrCodes } = await supabase
        .from('qr_codes')
        .select('id')
        .in('link_id', linkIds);

      if (links.length > 3 && (!qrCodes || qrCodes.length === 0)) {
        recommendations.push({
          workspace_id: workspace.id,
          recommendation_type: 'suggestion',
          title: 'try qr codes for offline campaigns',
          description: `you have ${links.length} links but no qr codes yet. qr codes are perfect for print materials, events, and in-store promotions.`,
          action_url: '/links',
          action_label: 'generate qr code',
        });
      }

      // Pattern: Best performing day
      if (recentClicks && recentClicks.length > 20) {
        const clicksByDay: Record<string, number> = {};
        recentClicks.forEach(click => {
          const day = new Date(click.clicked_at).toLocaleDateString('en-US', { weekday: 'long' });
          clicksByDay[day] = (clicksByDay[day] || 0) + 1;
        });

        const bestDay = Object.entries(clicksByDay).sort((a, b) => b[1] - a[1])[0];
        if (bestDay && bestDay[1] > 5) {
          recommendations.push({
            workspace_id: workspace.id,
            recommendation_type: 'pattern',
            title: `${bestDay[0]}s are your best day`,
            description: `${bestDay[0]}s get ${Math.round((bestDay[1] / recentClickCount) * 100)}% of your weekly clicks. schedule important campaigns for ${bestDay[0]}s.`,
            action_url: '/analytics',
            action_label: 'view patterns',
          });
        }
      }

      // Insert recommendations (delete old ones first)
      await supabase
        .from('ai_recommendations')
        .delete()
        .eq('workspace_id', workspace.id)
        .eq('dismissed', false);

      if (recommendations.length > 0) {
        await supabase
          .from('ai_recommendations')
          .insert(recommendations);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Recommendations generated' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
