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
  
  // Cookie utilities
  function getCookie(name) {
    var value = '; ' + d.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    d.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax';
  }
  
  // Get or generate visitor ID
  function getVisitorId() {
    // Check URL for utm_vid parameter
    var urlParams = new URLSearchParams(w.location.search);
    var urlVid = urlParams.get('utm_vid');
    
    if (urlVid) {
      setCookie('utm_visitor_id', urlVid, 30);
      return urlVid;
    }
    
    // Check existing cookie
    var cookieVid = getCookie('utm_visitor_id');
    if (cookieVid) {
      return cookieVid;
    }
    
    // Generate new visitor ID
    var newVid = 'v_' + Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    setCookie('utm_visitor_id', newVid, 30);
    return newVid;
  }
  
  // Initialize visitor ID
  var visitorId = getVisitorId();
  
  // Initialize tracking queue
  w.utmone = w.utmone || function() {
    (w.utmone.q = w.utmone.q || []).push(arguments);
  };
  
  w.utmone.pixelId = pixelId;
  w.utmone.visitorId = visitorId;
  
  // Base tracking URL
  var baseUrl = '${Deno.env.get('SUPABASE_URL')}/functions/v1/track-pixel';
  var identifyUrl = '${Deno.env.get('SUPABASE_URL')}/functions/v1/identify-visitor';
  
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
  
  // Identify user function
  w.utmone.identify = function(email, name) {
    if (!email) {
      console.warn('[utm.one] identify() requires email parameter');
      return;
    }
    
    var payload = {
      visitor_id: visitorId,
      pixel_id: pixelId,
      email: email,
      name: name || null
    };
    
    // Send identification data
    fetch(identifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).then(function(response) {
      if (response.ok) {
        console.log('[utm.one] User identified:', email);
      } else {
        console.error('[utm.one] Identification failed:', response.status);
      }
    }).catch(function(error) {
      console.error('[utm.one] Identification error:', error);
    });
  };
  
  // Process queued calls
  var q = w.utmone.q || [];
  for (var i = 0; i < q.length; i++) {
    if (q[i][0] === 'track') {
      w.utmone.track(q[i][1], q[i][2]);
    } else if (q[i][0] === 'identify') {
      w.utmone.identify(q[i][1], q[i][2]);
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