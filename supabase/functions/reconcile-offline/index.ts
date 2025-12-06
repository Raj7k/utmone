import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface OfflineConversion {
  email: string;
  revenue: number;
  conversion_date: string;
  metadata?: Record<string, unknown>;
}

interface ReconcilePayload {
  workspace_id: string;
  conversions: OfflineConversion[];
  source_file?: string;
  user_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: ReconcilePayload = await req.json();
    const { workspace_id, conversions, source_file, user_id } = payload;

    if (!workspace_id || !conversions || !Array.isArray(conversions)) {
      return new Response(
        JSON.stringify({ error: 'workspace_id and conversions array are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[reconcile-offline] Processing ${conversions.length} conversions for workspace ${workspace_id}`);

    // Create import batch record
    const { data: batch, error: batchError } = await supabase
      .from('import_batches')
      .insert({
        workspace_id,
        file_name: source_file || 'api_import',
        total_rows: conversions.length,
        status: 'processing',
        imported_by: user_id,
      })
      .select()
      .single();

    if (batchError) {
      console.error('[reconcile-offline] Batch creation error:', batchError);
      throw batchError;
    }

    let matchedCount = 0;
    let unmatchedCount = 0;
    const results: Array<{ email: string; status: string; visitor_id?: string }> = [];

    for (const conversion of conversions) {
      const { email, revenue, conversion_date, metadata } = conversion;

      if (!email || !conversion_date) {
        results.push({ email: email || 'unknown', status: 'invalid' });
        unmatchedCount++;
        continue;
      }

      // Try to find matching identity by email
      const { data: identity, error: identityError } = await supabase
        .from('visitor_identities')
        .select('visitor_id, user_id')
        .eq('email', email.toLowerCase())
        .eq('workspace_id', workspace_id)
        .maybeSingle();

      if (identityError) {
        console.error('[reconcile-offline] Identity lookup error:', identityError);
      }

      // Also check profiles table
      let profileUserId: string | null = null;
      if (!identity) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email.toLowerCase())
          .maybeSingle();
        profileUserId = profile?.id || null;
      }

      const matchedVisitorId = identity?.visitor_id || null;
      const matchedUserId = identity?.user_id || profileUserId;
      const matchStatus = (matchedVisitorId || matchedUserId) ? 'matched' : 'unmatched';

      // Insert offline conversion record
      const { error: insertError } = await supabase
        .from('offline_conversions')
        .insert({
          workspace_id,
          email: email.toLowerCase(),
          revenue: revenue || 0,
          conversion_date,
          source_file: source_file || 'api_import',
          matched_visitor_id: matchedVisitorId,
          matched_user_id: matchedUserId,
          match_status: matchStatus,
          metadata: metadata || {},
          imported_by: user_id,
        });

      if (insertError) {
        console.error('[reconcile-offline] Insert error:', insertError);
        results.push({ email, status: 'error' });
        unmatchedCount++;
        continue;
      }

      if (matchStatus === 'matched') {
        matchedCount++;
        results.push({ email, status: 'matched', visitor_id: matchedVisitorId || undefined });

        // If matched, also create a journey event for attribution
        if (matchedVisitorId || matchedUserId) {
          // Find the most recent link click for this visitor to get link_id
          const { data: recentClick } = await supabase
            .from('link_clicks')
            .select('link_id')
            .eq('workspace_id', workspace_id)
            .eq('visitor_id', matchedVisitorId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (recentClick?.link_id) {
            await supabase
              .from('conversion_events')
              .insert({
                workspace_id,
                link_id: recentClick.link_id,
                event_type: 'offline_conversion',
                event_name: 'Offline Sale',
                event_value: revenue || 0,
                visitor_id: matchedVisitorId,
                user_identifier: email,
                attributed_at: conversion_date,
                metadata: { source: 'offline_import', ...metadata },
              });
            console.log(`[reconcile-offline] Created conversion event for ${email}`);
          }
        }
      } else {
        unmatchedCount++;
        results.push({ email, status: 'unmatched' });
      }
    }

    // Update batch with results
    await supabase
      .from('import_batches')
      .update({
        matched_rows: matchedCount,
        unmatched_rows: unmatchedCount,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', batch.id);

    const matchRate = conversions.length > 0 
      ? Math.round((matchedCount / conversions.length) * 100) 
      : 0;

    console.log(`[reconcile-offline] Completed: ${matchedCount} matched, ${unmatchedCount} unmatched (${matchRate}% match rate)`);

    return new Response(
      JSON.stringify({
        success: true,
        batch_id: batch.id,
        total_rows: conversions.length,
        matched_rows: matchedCount,
        unmatched_rows: unmatchedCount,
        match_rate: matchRate,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[reconcile-offline] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
