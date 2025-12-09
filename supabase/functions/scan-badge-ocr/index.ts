import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OCRResponse {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  company?: string;
  title?: string;
  phone?: string;
  confidence: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'OCR service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing badge image for OCR...');

    // Call Lovable AI Gateway with vision model
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert OCR specialist extracting contact information from event badge images.

EXTRACT THESE FIELDS:
- First Name (separate from titles/honorifics)
- Last Name (family name)
- Job Title (look for: Manager, VP, Director, Engineer, Head of, Chief, etc.)
- Company/Organization (NOT the event name)
- Email address (if visible)
- Phone number (if visible)
- Badge Type (Speaker, VIP, Exhibitor, Attendee, Sponsor, Press, Staff)

RETURN ONLY this JSON structure:
{
  "firstName": "string or null",
  "lastName": "string or null", 
  "fullName": "string or null",
  "email": "string or null",
  "company": "string or null",
  "title": "string or null",
  "phone": "string or null",
  "badgeType": "string or null",
  "confidence": number 0-100,
  "enrichmentNeeded": boolean,
  "fieldConfidence": {
    "firstName": number 0-100,
    "lastName": number 0-100,
    "email": number 0-100,
    "company": number 0-100,
    "title": number 0-100
  }
}

PARSING RULES:
1. If you see "Marketing Guru" or similar, that's a Job Title, NOT a name
2. Company names often appear smaller or at the bottom
3. Badge Type usually appears as a colored stripe or large text (SPEAKER, VIP, etc.)
4. If email is missing, set enrichmentNeeded to true
5. Separate honorifics (Dr., Mr., Ms.) from the first name

OCR ERROR DETECTION:
- "rn" often misread as "m" (e.g., "Barn" → "Bam")
- "0" vs "O" confusion
- "1" vs "l" vs "I" confusion
- If you detect potential artifacts, lower fieldConfidence accordingly

Set confidence based on text clarity. Be conservative with low-quality images.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract the contact information from this event badge image. Return only the JSON object.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ]
      })
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
          JSON.stringify({ error: 'AI credits depleted. Please add funds.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'OCR processing failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';

    console.log('AI Response:', content);

    // Parse the JSON from the response
    let extractedData: OCRResponse;
    try {
      // Try to extract JSON from the response (might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      extractedData = {
        confidence: 0
      };
    }

    // Ensure all expected fields exist
    const result: OCRResponse = {
      firstName: extractedData.firstName || undefined,
      lastName: extractedData.lastName || undefined,
      fullName: extractedData.fullName || undefined,
      email: extractedData.email || undefined,
      company: extractedData.company || undefined,
      title: extractedData.title || undefined,
      phone: extractedData.phone || undefined,
      confidence: extractedData.confidence || 50
    };

    // If we got fullName but not firstName/lastName, split it
    if (result.fullName && !result.firstName) {
      const parts = result.fullName.trim().split(/\s+/);
      result.firstName = parts[0] || undefined;
      result.lastName = parts.slice(1).join(' ') || undefined;
    }

    console.log('Extracted data:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scan-badge-ocr:', error);
    const errorMessage = error instanceof Error ? error.message : 'OCR processing failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});