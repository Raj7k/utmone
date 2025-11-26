import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId } = await req.json();

    // Update user with approval timestamp and founding member badge
    const { error: updateError } = await supabase
      .from('early_access_requests')
      .update({
        approval_timestamp: new Date().toISOString(),
        badge: 'founding_member',
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Queue Email 6 (you're in)
    await supabase.functions.invoke('send-drip-email', {
      body: { userId, emailType: 'drip_email_6' }
    });

    // Queue founding badge email (1 hour later via schedule-drip-emails)
    const { data: campaign } = await supabase
      .from('email_campaigns')
      .select('id')
      .eq('template_name', 'drip_founding_badge')
      .single();

    if (campaign) {
      await supabase
        .from('email_queue')
        .insert({
          user_id: userId,
          campaign_id: campaign.id,
          scheduled_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
          status: 'pending',
        });
    }

    // Queue referral incentive email (3 days later)
    const { data: referralCampaign } = await supabase
      .from('email_campaigns')
      .select('id')
      .eq('template_name', 'drip_referral_incentive')
      .single();

    if (referralCampaign) {
      await supabase
        .from('email_queue')
        .insert({
          user_id: userId,
          campaign_id: referralCampaign.id,
          scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          status: 'pending',
        });
    }

    console.log(`Triggered approval drip for user ${userId}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
