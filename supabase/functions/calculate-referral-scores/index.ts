import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting referral score calculation...');

    // Get all users who have referrals
    const { data: users, error: usersError } = await supabaseClient
      .from('early_access_requests')
      .select('id, referral_code');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    let updatedCount = 0;

    // Calculate referral score for each user
    for (const user of users || []) {
      // Count direct referrals
      const { count: directReferrals, error: countError } = await supabaseClient
        .from('early_access_requests')
        .select('id', { count: 'exact', head: true })
        .eq('referred_by', user.id);

      if (countError) {
        console.error(`Error counting referrals for user ${user.id}:`, countError);
        continue;
      }

      // Get engagement scores of referred users
      const { data: referredUsers, error: referredError } = await supabaseClient
        .from('early_access_requests')
        .select('engagement_score, fit_score')
        .eq('referred_by', user.id);

      if (referredError) {
        console.error(`Error fetching referred users for ${user.id}:`, referredError);
        continue;
      }

      // Calculate referral score:
      // Base: 10 points per referral
      // Bonus: 5 points if referred user has high engagement (>20)
      // Bonus: 3 points if referred user has high fit score (>15)
      let referralScore = (directReferrals || 0) * 10;

      referredUsers?.forEach(referred => {
        if (referred.engagement_score > 20) referralScore += 5;
        if (referred.fit_score > 15) referralScore += 3;
      });

      // Update user's referral score
      const { error: updateError } = await supabaseClient
        .from('early_access_requests')
        .update({ referral_score: referralScore })
        .eq('id', user.id);

      if (updateError) {
        console.error(`Error updating score for user ${user.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }

    // Recalculate total access scores
    const { data: allUsers, error: allUsersError } = await supabaseClient
      .from('early_access_requests')
      .select('id, engagement_score, referral_score, fit_score');

    if (allUsersError) {
      console.error('Error fetching all users for total score:', allUsersError);
      throw allUsersError;
    }

    // Update total_access_score for all users
    for (const user of allUsers || []) {
      const totalScore = (user.engagement_score || 0) + 
                        (user.referral_score || 0) + 
                        (user.fit_score || 0);

      await supabaseClient
        .from('early_access_requests')
        .update({ total_access_score: totalScore })
        .eq('id', user.id);
    }

    console.log(`Successfully updated referral scores for ${updatedCount} users`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        updated_count: updatedCount,
        total_users: users?.length || 0,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in calculate-referral-scores function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
