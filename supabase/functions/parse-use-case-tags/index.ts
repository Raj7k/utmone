import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Keyword to tag mapping
const keywordMap: Record<string, string[]> = {
  'campaigns': ['campaign', 'email', 'marketing campaign', 'utm campaign'],
  'qr': ['qr', 'qr code', 'events', 'conference', 'booth', 'print'],
  'metadata': ['metadata', 'ai', 'llm', 'machine', 'seo', 'semantic'],
  'governance': ['tracking', 'naming', 'governance', 'clean', 'structure', 'rules'],
  'partner': ['attribution', 'partner', 'affiliate', 'referral', 'commission'],
  'analytics': ['analytics', 'reporting', 'data', 'insights', 'metrics'],
};

function extractTags(text: string): string[] {
  const lowerText = text.toLowerCase();
  const tags = new Set<string>();

  for (const [tag, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        tags.add(tag);
        break;
      }
    }
  }

  return Array.from(tags);
}

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

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('early_access_requests')
      .select('reason_for_joining, reason_details')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new Error('User not found');
    }

    // Extract tags from text fields
    const textToAnalyze = `${user.reason_for_joining || ''} ${user.reason_details || ''}`;
    const tags = extractTags(textToAnalyze);

    // Update user with extracted tags
    const { error: updateError } = await supabase
      .from('early_access_requests')
      .update({ use_case_tags: tags })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    console.log(`Extracted tags for user ${userId}:`, tags);

    return new Response(
      JSON.stringify({ success: true, tags }),
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
