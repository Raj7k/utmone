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
    const { payoutId, adminUserId } = await req.json();

    if (!payoutId || !adminUserId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch payout details
    const { data: payout, error: payoutError } = await supabase
      .from('partner_payouts')
      .select('*, partners!inner(*)')
      .eq('id', payoutId)
      .single();

    if (payoutError || !payout) {
      throw new Error('Payout not found');
    }

    // Process Stripe transfer (placeholder - requires STRIPE_SECRET_KEY)
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (stripeSecretKey && payout.partners.stripe_connect_id) {
      const transferResponse = await fetch('https://api.stripe.com/v1/transfers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: String(Math.round(payout.amount * 100)), // Convert to cents
          currency: 'usd',
          destination: payout.partners.stripe_connect_id,
        }),
      });

      const transfer = await transferResponse.json();
      
      if (!transferResponse.ok) {
        throw new Error(transfer.error?.message || 'Stripe transfer failed');
      }

      // Update payout record
      await supabase
        .from('partner_payouts')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString(),
          processed_by: adminUserId,
          completed_at: new Date().toISOString(),
          transaction_id: transfer.id,
        })
        .eq('id', payoutId);

      // Update partner balance
      await supabase
        .from('partners')
        .update({
          pending_payout: Math.max(0, payout.partners.pending_payout - payout.amount),
          lifetime_payout: (payout.partners.lifetime_payout || 0) + payout.amount,
          last_payout_at: new Date().toISOString(),
        })
        .eq('id', payout.partner_id);

      console.log(`Payout processed: $${payout.amount} to ${payout.partners.partner_code}`);
    } else {
      // Manual payout (update status only)
      await supabase
        .from('partner_payouts')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString(),
          processed_by: adminUserId,
          completed_at: new Date().toISOString(),
          notes: 'Manual payout - Stripe Connect not configured',
        })
        .eq('id', payoutId);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Payout processing error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
