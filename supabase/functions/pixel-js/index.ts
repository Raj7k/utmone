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
76:   var baseUrl = '${Deno.env.get('SUPABASE_URL')}/functions/v1/track-pixel';
77:   var identifyUrl = '${Deno.env.get('SUPABASE_URL')}/functions/v1/identify-visitor';
78:   var identityMatchUrl = '${Deno.env.get('SUPABASE_URL')}/functions/v1/identity-matching';
79:   
80:   // Track event function
81:   w.utmone.track = function(eventType, params) {
82:     params = params || {};
83:     
84:     var url = baseUrl + 
85:       '?pixel_id=' + encodeURIComponent(pixelId) +
86:       '&event=' + encodeURIComponent(eventType);
87:     
88:     if (params.revenue) {
89:       url += '&revenue=' + encodeURIComponent(params.revenue);
90:     }
91:     
92:     if (params.event_name) {
93:       url += '&event_name=' + encodeURIComponent(params.event_name);
94:     }
95:     
96:     // Send beacon (works even during page unload)
97:     if (navigator.sendBeacon) {
98:       navigator.sendBeacon(url);
99:     } else {
100:       // Fallback for older browsers
101:       var img = new Image();
102:       img.src = url;
103:     }
104:     
105:     console.log('[utm.one] Tracked:', eventType, params);
106:     
107:     // Trigger cross-device identity matching on pageviews (fire and forget)
108:     if (eventType === 'pageview') {
109:       fetch(identityMatchUrl, {
110:         method: 'POST',
111:         headers: { 'Content-Type': 'application/json' },
112:         body: JSON.stringify({
113:           visitor_id: visitorId,
114:           pixel_id: pixelId,
115:           user_agent: navigator.userAgent,
116:           timestamp: new Date().toISOString()
117:         }),
118:         keepalive: true
119:       }).catch(function() { /* ignore errors */ });
120:     }
121:   };
  
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