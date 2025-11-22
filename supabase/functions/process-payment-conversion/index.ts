import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, paymentAmount, referralCode } = await req.json();

    if (!userId || !paymentAmount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If referral code exists, track conversion
    if (referralCode) {
      // Find referral record
      const { data: referral, error: referralError } = await supabase
        .from('partner_referrals')
        .select('*, partners!inner(*)')
        .eq('referral_code', referralCode)
        .eq('referred_user_id', userId)
        .single();

      if (referralError) {
        console.error('Referral not found:', referralError);
        return new Response(
          JSON.stringify({ error: 'Referral not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Calculate commission (default 10%)
      const commissionRate = referral.partners.commission_rate || 0.1;
      const commissionEarned = paymentAmount * commissionRate;

      // Update referral record
      await supabase
        .from('partner_referrals')
        .update({
          status: 'converted',
          conversion_date: new Date().toISOString(),
          conversion_value: paymentAmount,
          commission_earned: commissionEarned,
          first_payment_date: new Date().toISOString(),
        })
        .eq('id', referral.id);

      // Update partner totals
      await supabase
        .from('partners')
        .update({
          total_conversions: (referral.partners.total_conversions || 0) + 1,
          total_revenue: (referral.partners.total_revenue || 0) + paymentAmount,
          total_earnings: (referral.partners.total_earnings || 0) + commissionEarned,
          pending_payout: (referral.partners.pending_payout || 0) + commissionEarned,
        })
        .eq('id', referral.partner_id);

      console.log(`Conversion tracked: $${paymentAmount} -> $${commissionEarned} commission`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Payment conversion error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
