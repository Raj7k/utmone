import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MapboxFeature {
  id: string;
  place_name: string;
  text: string;
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
  center: [number, number];
}

interface CityResult {
  name: string;
  region: string;
  country: string;
  countryCode: string;
  fullName: string;
  coordinates: [number, number];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const MAPBOX_TOKEN = Deno.env.get('MAPBOX_ACCESS_TOKEN');
    if (!MAPBOX_TOKEN) {
      console.error('MAPBOX_ACCESS_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Geocoding service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?types=place&limit=5&access_token=${MAPBOX_TOKEN}`;

    console.log(`Geocoding query: ${query}`);

    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Mapbox API error:', response.status, await response.text());
      return new Response(
        JSON.stringify({ error: 'Geocoding service unavailable' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    const results: CityResult[] = (data.features || []).map((feature: MapboxFeature) => {
      let region = '';
      let country = '';
      let countryCode = '';

      if (feature.context) {
        for (const ctx of feature.context) {
          if (ctx.id.startsWith('region')) {
            region = ctx.text;
          } else if (ctx.id.startsWith('country')) {
            country = ctx.text;
            countryCode = ctx.short_code?.toUpperCase() || '';
          }
        }
      }

      return {
        name: feature.text,
        region,
        country,
        countryCode,
        fullName: feature.place_name,
        coordinates: feature.center,
      };
    });

    console.log(`Found ${results.length} cities for query: ${query}`);

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Geocode error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to geocode city' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
