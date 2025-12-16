import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkEmailQuality } from "../../../src/shared-core/email/emailQuality.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, source, referralCode, pageUrl, metadata } = await req.json();

    const quality = checkEmailQuality(email, { allowDisposable: true });
    if (!quality.ok && quality.reason !== "disposable") {
      return new Response(
        JSON.stringify({
          error: 'Invalid email format',
          reason: quality.reason,
          suggestion: quality.suggestion,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = quality.normalizedEmail || (email || "").trim().toLowerCase();

    // Create Supabase client with service role for insert
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upsert email lead (update if exists, insert if new)
    const { data, error } = await supabase
      .from('email_leads')
      .upsert(
        {
          email: normalizedEmail,
          source: source || 'inline_cta',
          referral_code: referralCode || null,
          page_url: pageUrl || null,
          metadata: {
            ...(metadata || {}),
            normalized_email: normalizedEmail,
            is_disposable: quality.reason === "disposable",
            email_quality_reason: quality.reason,
            email_suggestion_shown: !!quality.suggestion,
          },
        },
        { 
          onConflict: 'email',
          ignoreDuplicates: false 
        }
      )
      .select('id, email, created_at')
      .single();

    if (error) {
      console.error('Error capturing email lead:', error);
      // Don't fail - still return success for UX
      return new Response(
        JSON.stringify({ success: true, message: 'Email captured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Email lead captured: ${email} from ${source}`);

    return new Response(
      JSON.stringify({
        success: true,
        leadId: data?.id,
        email: normalizedEmail,
        email_quality_reason: quality.reason,
        is_disposable: quality.reason === "disposable",
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in capture-email-lead:', error);
    // Still return success for UX - don't block modal opening
    return new Response(
      JSON.stringify({ success: true, message: 'Email processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
