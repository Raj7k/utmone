import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FitScoreRequest {
  requestId: string;
}

/**
 * Calculate ICP Fit Score based on user attributes
 * 
 * Fit Score Formula (0-50 points):
 * - Company Size:
 *   - 100-1000 employees: +20 points
 *   - 20-100 employees: +10 points
 *   - <20 employees: +5 points
 * 
 * - Role Match:
 *   - Marketing Ops / Data Engineer: +20 points
 *   - Marketing / Sales: +10 points
 *   - Other: +5 points
 * 
 * - Company Domain Quality:
 *   - Valid corporate domain: +10 points
 *   - Generic email (gmail, etc.): 0 points
 * 
 * - Expected Usage Intensity:
 *   - Detailed reason + domain provided: +10 points
 *   - Basic reason: +5 points
 */
function calculateFitScore(request: any): number {
  let score = 0;

  // Company size scoring (0-20 points)
  const teamSize = request.team_size?.toLowerCase() || '';
  if (teamSize.includes('100') || teamSize.includes('1000') || teamSize.includes('500')) {
    score += 20; // 100-1000 employees
  } else if (teamSize.includes('20') || teamSize.includes('50')) {
    score += 10; // 20-100 employees
  } else if (teamSize.includes('10') || teamSize.includes('1-')) {
    score += 5; // Small team
  }

  // Role scoring (0-20 points)
  const role = request.role?.toLowerCase() || '';
  if (role.includes('ops') || role.includes('data') || role.includes('engineer')) {
    score += 20; // Marketing Ops / Data Engineer
  } else if (role.includes('marketing') || role.includes('sales')) {
    score += 10; // Marketing / Sales
  } else if (role) {
    score += 5; // Other roles
  }

  // Company domain quality scoring (0-10 points)
  const companyDomain = request.company_domain || '';
  const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  const isGeneric = genericDomains.some(d => companyDomain.includes(d));
  
  if (companyDomain && !isGeneric) {
    score += 10; // Valid corporate domain
  }

  // Expected usage intensity based on reason + desired domain (0-10 points)
  const hasDetailedReason = (request.reason_details?.length || 0) > 50;
  const hasDesiredDomain = !!request.desired_domain;
  
  if (hasDetailedReason && hasDesiredDomain) {
    score += 10; // High intent
  } else if (hasDetailedReason || hasDesiredDomain) {
    score += 5; // Medium intent
  }

  return Math.min(score, 50); // Cap at 50 points
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

    const { requestId }: FitScoreRequest = await req.json();

    // Fetch the early access request
    const { data: request, error: fetchError } = await supabase
      .from('early_access_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError) throw fetchError;

    // Calculate fit score
    const fitScore = calculateFitScore(request);

    // Calculate total access score
    const engagementScore = request.engagement_score || 0;
    const referralScore = request.referral_score || 0;
    const totalAccessScore = engagementScore + referralScore + fitScore;

    // Determine access level based on total score
    let accessLevel = 0; // Waitlist
    if (totalAccessScore >= 100) {
      accessLevel = 4; // Power User
    } else if (totalAccessScore >= 75) {
      accessLevel = 3; // Full Access
    } else if (totalAccessScore >= 40) {
      accessLevel = 2; // Limited Beta
    } else if (totalAccessScore >= 20) {
      accessLevel = 1; // Preview Mode
    }

    // Update the request with calculated scores
    const { error: updateError } = await supabase
      .from('early_access_requests')
      .update({
        fit_score: fitScore,
        total_access_score: totalAccessScore,
        access_level: accessLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    console.log(`Fit score calculated for ${requestId}: ${fitScore} (total: ${totalAccessScore}, level: ${accessLevel})`);

    return new Response(
      JSON.stringify({
        success: true,
        fit_score: fitScore,
        total_access_score: totalAccessScore,
        access_level: accessLevel,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error calculating fit score:', error);
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
