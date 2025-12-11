import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Location to landmark mapping for background elements
const locationLandmarks: Record<string, string> = {
  "San Francisco": "Golden Gate Bridge, Transamerica Pyramid, cable car silhouette, rolling hills",
  "Singapore": "Marina Bay Sands hotel with three towers and rooftop boat, Merlion statue, modern skyline",
  "Boston": "Faneuil Hall, Charles River bridge, historic red brick buildings, sailboats",
  "Copenhagen": "Colorful Nyhavn harbor houses, Round Tower spire, windmills",
  "Toronto": "CN Tower, Toronto skyline, waterfront",
  "Mountain View": "Tech campus buildings, rolling green hills, palm trees",
  "San Diego": "Coronado Bridge, palm trees, beach waves, Spanish architecture",
  "Portland": "Mt. Hood snow-capped peak, pine trees, Hawthorne Bridge",
  "Bangalore": "Vidhana Soudha building dome, tech patterns, temple gopuram silhouette",
};

function buildStampPrompt(location: string, name: string): string {
  const landmarks = locationLandmarks[location] || "iconic city landmarks and skyline";
  
  return `Transform this portrait photo into a geometric flat-style travel stamp illustration.

STYLE REQUIREMENTS:
- Bold geometric shapes - simplify the person's face and features into clean, stylized shapes with character
- Flat vivid colors - use a harmonious 3-5 color palette (no gradients, no shadows, no lighting effects)
- Clean edges with no strokes unless decorative
- The person should be recognizable but beautifully stylized as a geometric portrait

BACKGROUND ELEMENTS for ${location}:
Include 2-3 iconic landmarks behind/around the geometric portrait: ${landmarks}
These landmarks should be simplified into the same geometric flat style as the portrait.

STAMP FRAME:
- Perforated postage stamp edge (scalloped/dotted border around all edges)
- Stamp artwork occupies 60-70% of the canvas, centered with consistent margins
- Solid background color distinct from stamp interior
- NO text or typography inside the stamp - rely on illustration only

COMPOSITION:
- Portrait centered in the stamp
- Landmarks arranged artfully in background
- Balanced and iconic layout
- Avoid empty or overly abstract results

OUTPUT:
- Square 1:1 aspect ratio
- PNG format
- Solid color behind the stamp frame`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { architectId, photoUrl, location, name } = await req.json();

    if (!photoUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing photoUrl' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if stamp already exists in storage (only if architectId provided)
    if (architectId) {
      const stampPath = `stamps/${architectId}.png`;
      const { data: fileData, error: fileError } = await supabase.storage
        .from('architect-stamps')
        .download(stampPath);

      if (fileData && !fileError) {
        const { data: publicUrlData } = await supabase.storage
          .from('architect-stamps')
          .getPublicUrl(stampPath);
        
        console.log(`Stamp already exists for ${architectId}, returning cached version`);
        return new Response(
          JSON.stringify({ 
            stampUrl: publicUrlData.publicUrl,
            cached: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build location-aware prompt
    const promptText = buildStampPrompt(location || 'San Francisco', name || 'Professional');
    
    console.log(`Generating stamp for ${name || architectId} in ${location || 'unknown location'}`);
    console.log(`Photo URL: ${photoUrl}`);

    // Call Lovable AI to generate the stamp with image editing
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              { type: 'image_url', image_url: { url: photoUrl } }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
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

    // If architectId provided, cache the stamp in storage
    if (architectId) {
      try {
        const base64Data = generatedImageUrl.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const stampPath = `stamps/${architectId}.png`;

        const { error: uploadError } = await supabase.storage
          .from('architect-stamps')
          .upload(stampPath, imageBuffer, {
            contentType: 'image/png',
            upsert: true
          });

        if (!uploadError) {
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
        }
      } catch (uploadErr) {
        console.error('Upload error:', uploadErr);
      }
    }

    // Return base64 directly if no caching or cache failed
    console.log(`Stamp generated for ${name || architectId}`);
    return new Response(
      JSON.stringify({ 
        stampUrl: generatedImageUrl,
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
