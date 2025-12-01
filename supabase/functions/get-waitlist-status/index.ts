import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StatusRequest {
  email: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email }: StatusRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[Waitlist Status] Fetching status for:', email);

    // Fetch user's waitlist data
    const { data: userData, error: userError } = await supabase
      .from('early_access_requests')
      .select('id, name, email, position, status, referral_code, referral_count, total_access_score, engagement_score, referral_score, fit_score, created_at')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.error('[Waitlist Status] User not found:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found', found: false }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user's badges
    const { data: userBadges } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at, waitlist_badges(name, description, icon, color)')
      .eq('user_id', userData.id);

    // Calculate queue position (count users with better position)
    const { count: queuePosition } = await supabase
      .from('early_access_requests')
      .select('*', { count: 'exact', head: true })
      .lt('position', userData.position || 999999)
      .neq('status', 'rejected');

    console.log('[Waitlist Status] Successfully fetched data for:', email);

    return new Response(
      JSON.stringify({
        found: true,
        user: userData,
        badges: userBadges || [],
        queuePosition: (queuePosition || 0) + 1,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Waitlist Status] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
