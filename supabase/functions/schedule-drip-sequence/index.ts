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

    console.log('Starting drip email sequence scheduling...');

    const now = new Date();
    let totalScheduled = 0;

    // Day 2 emails - users who signed up 2 days ago
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const { data: day2Users } = await supabase
      .from('early_access_requests')
      .select('id, email, created_at')
      .gte('created_at', twoDaysAgo.toISOString().split('T')[0])
      .lt('created_at', new Date(twoDaysAgo.getTime() + 86400000).toISOString().split('T')[0]);

    for (const user of day2Users || []) {
      await supabase.functions.invoke('send-drip-email', {
        body: { userId: user.id, emailType: 'day_2' },
      });
      totalScheduled++;
    }

    // Day 5 emails
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const { data: day5Users } = await supabase
      .from('early_access_requests')
      .select('id, email, created_at')
      .gte('created_at', fiveDaysAgo.toISOString().split('T')[0])
      .lt('created_at', new Date(fiveDaysAgo.getTime() + 86400000).toISOString().split('T')[0]);

    for (const user of day5Users || []) {
      await supabase.functions.invoke('send-drip-email', {
        body: { userId: user.id, emailType: 'day_5' },
      });
      totalScheduled++;
    }

    // Day 10 emails
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const { data: day10Users } = await supabase
      .from('early_access_requests')
      .select('id, email, created_at')
      .gte('created_at', tenDaysAgo.toISOString().split('T')[0])
      .lt('created_at', new Date(tenDaysAgo.getTime() + 86400000).toISOString().split('T')[0]);

    for (const user of day10Users || []) {
      await supabase.functions.invoke('send-drip-email', {
        body: { userId: user.id, emailType: 'day_10' },
      });
      totalScheduled++;
    }

    console.log(`Scheduled ${totalScheduled} drip emails`);

    return new Response(
      JSON.stringify({ success: true, totalScheduled }),
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
