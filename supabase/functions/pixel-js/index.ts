import { getSecureCorsHeaders } from '../_shared/security-headers.ts';

const corsHeaders = getSecureCorsHeaders();

Deno.serve((req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const pixelId = url.searchParams.get('id');

  if (!pixelId) {
    return new Response('Missing pixel ID', { status: 400 });
  }

  const pixelScript = `
(function(w, d, pixelId) {
  'use strict';
  
  // Initialize tracking queue
  w.utmone = w.utmone || function() {
    (w.utmone.q = w.utmone.q || []).push(arguments);
  };
  
  w.utmone.pixelId = pixelId;
  
  // Base tracking URL
  var baseUrl = '${Deno.env.get('SUPABASE_URL')}/functions/v1/track-pixel';
  
  // Track event function
  w.utmone.track = function(eventType, params) {
    params = params || {};
    
    var url = baseUrl + 
      '?pixel_id=' + encodeURIComponent(pixelId) +
      '&event=' + encodeURIComponent(eventType);
    
    if (params.revenue) {
      url += '&revenue=' + encodeURIComponent(params.revenue);
    }
    
    if (params.event_name) {
      url += '&event_name=' + encodeURIComponent(params.event_name);
    }
    
    // Send beacon (works even during page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      // Fallback for older browsers
      var img = new Image();
      img.src = url;
    }
    
    console.log('[utm.one] Tracked:', eventType, params);
  };
  
  // Process queued calls
  var q = w.utmone.q || [];
  for (var i = 0; i < q.length; i++) {
    if (q[i][0] === 'track') {
      w.utmone.track(q[i][1], q[i][2]);
    }
  }
  
  // Auto-track pageview
  w.utmone.track('pageview');
  
})(window, document, '${pixelId}');
`;

  return new Response(pixelScript, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});