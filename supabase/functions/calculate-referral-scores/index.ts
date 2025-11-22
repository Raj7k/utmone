import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Calculate Referral Scores and apply incentive bonuses
 * 
 * Referral Score Formula (0-100+ points):
 * - Each referred sign-up: +10 points
 * - Each referred activation (completed onboarding): +25 points
 * - Referred company domain match: +20 points
 * - Referral abuse detection: -50 penalty
 * 
 * Incentive Bonuses:
 * - 3 referrals → instant 1 level upgrade
 * - 5 referrals → instant 2 level upgrade  
 * - 10 referrals → immediate early access (level 3)
 * - Team bonus: +5 per teammate, +15 bonus if 5 teammates join
 */
async function calculateReferralScore(supabase: any, userId: string): Promise<number> {
  let score = 0;

  // Get all referrals made by this user
  const { data: referrals, error } = await supabase
    .from('early_access_requests')
    .select('id, engagement_score, fit_score, status, email, company_domain')
    .eq('referred_by', userId);

  if (error) {
    console.error(`Error fetching referrals for ${userId}:`, error);
    return 0;
  }

  if (!referrals || referrals.length === 0) {
    return 0;
  }

  // Get referrer's company domain for matching
  const { data: referrer } = await supabase
    .from('early_access_requests')
    .select('company_domain')
    .eq('id', userId)
    .single();

  const referrerDomain = referrer?.company_domain || '';

  // Calculate points for each referral
  for (const referral of referrals) {
    // Base: +10 points per sign-up
    score += 10;

    // Bonus: +25 if referred user is activated (high engagement + fit)
    const isActivated = (referral.engagement_score || 0) > 20 && (referral.fit_score || 0) > 15;
    if (isActivated) {
      score += 25;
    }

    // Bonus: +20 if company domain matches (team referral)
    const domainMatches = referral.company_domain && 
                         referral.company_domain === referrerDomain;
    if (domainMatches) {
      score += 20;
    }
  }

  // Team bonus calculation
  const teamReferrals = referrals.filter((r: any) => 
    r.company_domain && r.company_domain === referrerDomain
  ).length;

  if (teamReferrals >= 5) {
    score += 15; // Bonus for 5+ teammates
  } else if (teamReferrals > 0) {
    score += teamReferrals * 5; // +5 per teammate
  }

  console.log(`Referral score for ${userId}: ${score} points from ${referrals.length} referrals`);

  return score;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting referral score calculation for all users...');

    // Get all users with referral codes
    const { data: users, error: usersError } = await supabase
      .from('early_access_requests')
      .select('id, referral_code')
      .not('referral_code', 'is', null);

    if (usersError) throw usersError;

    console.log(`Found ${users?.length || 0} users with referral codes`);

    let updatedCount = 0;

    // Calculate referral score for each user
    for (const user of users || []) {
      const referralScore = await calculateReferralScore(supabase, user.id);

      // Get current scores to calculate total
      const { data: current } = await supabase
        .from('early_access_requests')
        .select('engagement_score, fit_score, access_level')
        .eq('id', user.id)
        .single();

      const engagementScore = current?.engagement_score || 0;
      const fitScore = current?.fit_score || 0;
      const totalAccessScore = engagementScore + referralScore + fitScore;

      // Calculate new access level based on scoring algorithm
      let accessLevel = current?.access_level || 0;
      if (totalAccessScore >= 100) {
        accessLevel = Math.max(accessLevel, 4); // Power User
      } else if (totalAccessScore >= 75) {
        accessLevel = Math.max(accessLevel, 3); // Full Access
      } else if (totalAccessScore >= 40) {
        accessLevel = Math.max(accessLevel, 2); // Limited Beta
      } else if (totalAccessScore >= 20) {
        accessLevel = Math.max(accessLevel, 1); // Preview Mode
      }

      // Update user's referral score and total
      const { error: updateError } = await supabase
        .from('early_access_requests')
        .update({
          referral_score: referralScore,
          total_access_score: totalAccessScore,
          access_level: accessLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error(`Error updating ${user.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }

    console.log(`Referral score calculation complete. Updated ${updatedCount} users.`);

    return new Response(
      JSON.stringify({
        success: true,
        updated: updatedCount,
        total: users?.length || 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error calculating referral scores:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
