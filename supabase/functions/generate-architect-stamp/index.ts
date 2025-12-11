import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STAMP_PROMPT = `Transform this portrait photo into a geometric flat-style travel stamp illustration.

STYLE REFERENCE: Bold, geometric travel stamps like vintage postage — clean lines, balanced detail, and flat vector color design.

ILLUSTRATION STYLE:
- Shape language: Geometric and stylized — simplify the person into clear shapes with character
- Color palette: Flat, vivid colors — use a unique 3-5 color set derived from the photo
- Linework: Clean edges, no strokes unless decorative
- Texture: Flat fills only — no gradients, shadows, or lighting effects
- Detail level: Include 2-3 recognizable visual elements from the person (hair style, glasses, facial features)

STAMP FRAME:
- Type: Perforated postage stamp edge (dotted/perforated border around edges)
- Scale: Artwork should occupy 60-70% of canvas — centered
- Background: Solid muted background color distinct from stamp interior
- Label: No text — illustration only

OUTPUT: Square aspect ratio with solid background, vintage stamp aesthetic`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { architectId, photoUrl } = await req.json();

    if (!architectId || !photoUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing architectId or photoUrl' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if stamp already exists in storage
    const stampPath = `stamps/${architectId}.png`;
    const { data: existingFile } = await supabase.storage
      .from('architect-stamps')
      .getPublicUrl(stampPath);

    // Check if file actually exists by trying to download it
    const { data: fileData, error: fileError } = await supabase.storage
      .from('architect-stamps')
      .download(stampPath);

    if (fileData && !fileError) {
      console.log(`Stamp already exists for ${architectId}, returning cached version`);
      return new Response(
        JSON.stringify({ 
          stampUrl: existingFile.publicUrl,
          cached: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the full photo URL if it's a relative path
    const fullPhotoUrl = photoUrl.startsWith('http') 
      ? photoUrl 
      : `${supabaseUrl.replace('/rest/v1', '')}/storage/v1/object/public/architect-stamps/originals/${architectId}.jpeg`;

    console.log(`Generating stamp for ${architectId} from ${fullPhotoUrl}`);

    // Call Lovable AI to generate the stamp
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: STAMP_PROMPT },
              { type: 'image_url', image_url: { url: fullPhotoUrl } }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate stamp', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImageUrl) {
      console.error('No image in response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'No image generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract base64 data and upload to storage
    const base64Data = generatedImageUrl.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    const { error: uploadError } = await supabase.storage
      .from('architect-stamps')
      .upload(stampPath, imageBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Return the base64 directly if upload fails
      return new Response(
        JSON.stringify({ 
          stampUrl: generatedImageUrl,
          cached: false 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: publicUrlData } = await supabase.storage
      .from('architect-stamps')
      .getPublicUrl(stampPath);

    console.log(`Successfully generated and cached stamp for ${architectId}`);

    return new Response(
      JSON.stringify({ 
        stampUrl: publicUrlData.publicUrl,
        cached: false 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-architect-stamp:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
