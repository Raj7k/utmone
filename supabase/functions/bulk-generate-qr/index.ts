import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';
import QRCode from 'https://esm.sh/qrcode@1.5.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QRPreset {
  primaryColor: string;
  secondaryColor: string;
  cornerStyle: 'square' | 'rounded';
  frameText?: string;
}

interface LinkData {
  id: string;
  short_url: string;
  name: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { links, preset }: { links: LinkData[]; preset: QRPreset } = await req.json();

    if (!links || links.length === 0) {
      throw new Error('No links provided');
    }

    // Limit to 100 QR codes per request
    if (links.length > 100) {
      throw new Error('Maximum 100 QR codes per batch');
    }

    const results = [];

    for (const link of links) {
      try {
        // Generate QR code as PNG data URL
        const qrDataUrl = await QRCode.toDataURL(link.short_url, {
          color: {
            dark: preset.primaryColor,
            light: preset.secondaryColor,
          },
          width: 512,
          margin: 2,
        });

        // Convert data URL to blob
        const base64Data = qrDataUrl.split(',')[1];
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Upload to Supabase Storage
        const fileName = `${link.name}-${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('qr-codes')
          .upload(fileName, binaryData, {
            contentType: 'image/png',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('qr-codes')
          .getPublicUrl(fileName);

        // Insert QR code record
        const { error: insertError } = await supabase
          .from('qr_codes')
          .insert({
            link_id: link.id,
            name: link.name,
            variant_name: 'bulk-generated',
            image_url: publicUrl,
            customization: {
              primaryColor: preset.primaryColor,
              secondaryColor: preset.secondaryColor,
              cornerStyle: preset.cornerStyle,
              frameText: preset.frameText,
            },
            created_by: user.id,
          });

        if (insertError) throw insertError;

        results.push({
          link_id: link.id,
          name: link.name,
          png_url: publicUrl,
          success: true,
        });
      } catch (error: any) {
        console.error(`Failed to generate QR for ${link.name}:`, error);
        results.push({
          link_id: link.id,
          name: link.name,
          success: false,
          error: error?.message || 'Unknown error',
        });
      }
    }

    return new Response(
      JSON.stringify({ results }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Bulk QR generation error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
