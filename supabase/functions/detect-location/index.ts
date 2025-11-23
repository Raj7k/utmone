import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LocationData {
  country: string;
  country_code: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get IP address from headers (Cloudflare or standard)
    const ip = req.headers.get('cf-connecting-ip') || 
               req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') ||
               'unknown';

    console.log('Detecting location for IP:', ip);

    // Use ipapi.co for geolocation (free tier: 1000 requests/day)
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    
    if (!geoResponse.ok) {
      throw new Error('Geolocation service unavailable');
    }

    const geoData = await geoResponse.json();

    const locationData: LocationData = {
      country: geoData.country_name || 'United States',
      country_code: geoData.country_code || 'US',
      state: geoData.region || undefined,
      city: geoData.city || undefined,
      latitude: geoData.latitude || undefined,
      longitude: geoData.longitude || undefined,
    };

    console.log('Location detected:', locationData);

    return new Response(JSON.stringify(locationData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in detect-location function:', error);
    
    // Return default US location on error
    return new Response(JSON.stringify({
      country: 'United States',
      country_code: 'US',
      state: 'California',
      city: 'San Francisco',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
