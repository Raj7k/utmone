import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StampRequest {
  brandColors: string[];
  concept?: string;
  shortUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brandColors, concept, shortUrl }: StampRequest = await req.json();

    // Validate input
    if (!brandColors || brandColors.length < 2) {
      return new Response(
        JSON.stringify({ error: 'At least 2 brand colors are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format colors for prompt
    const colorList = brandColors.join(', ');
    const lightestColor = brandColors.reduce((lightest, color) => {
      const getLuminance = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return 0.299 * r + 0.587 * g + 0.114 * b;
      };
      return getLuminance(color) > getLuminance(lightest) ? color : lightest;
    }, brandColors[0]);

    // Build the AI prompt
    const userPrompt = `Create a square postage stamp illustration.

STRICT COLOR RULES:
- Use ONLY these exact colors: ${colorList}
- No other colors allowed
- The lightest color should be ${lightestColor}

COMPOSITION RULES:
- Outer border: Classic postage stamp perforated edge pattern
- Outer 30%: Detailed geometric patterns, travel motifs, vintage stamp decorations
- Center 50%: Must be SOLID and CLEAN using the lightest color (${lightestColor}) - this area will have a QR code overlaid
- The center must be a simple, solid rectangular or rounded area with minimal detail

STYLE:
- Flat geometric vector art
- Vintage travel stamp aesthetic
- Bold outlines and clean shapes
- ${concept ? `Theme: ${concept}` : 'Professional business aesthetic with subtle geometric patterns'}

FORBIDDEN:
- Do NOT include any text or letters
- Do NOT generate a QR code
- Do NOT use colors outside the brand palette
- Do NOT add complex patterns in the center area`;

    console.log('Generating stamp art with Lovable AI...');
    console.log('Brand colors:', colorList);
    console.log('Theme:', concept || 'default');

    // Call Lovable AI with image generation model
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add funds to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate stamp art' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract the generated image
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data, null, 2));
      return new Response(
        JSON.stringify({ error: 'No image generated', details: textResponse }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Stamp art generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl,
        brandColors,
        concept: concept || 'default',
        message: textResponse
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-stamp-art:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
