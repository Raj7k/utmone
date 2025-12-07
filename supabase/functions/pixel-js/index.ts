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
  var identityMatchUrl = '${Deno.env.get('SUPABASE_URL')}/functions/v1/identity-matching';
  
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
    
    // Add form-specific params
    if (params.form) {
      url += '&form=' + encodeURIComponent(params.form);
    }
    
    if (params.step) {
      url += '&step=' + encodeURIComponent(params.step);
    }
    
    if (params.auto_detected) {
      url += '&auto_detected=true';
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
    
    // Trigger cross-device identity matching on pageviews (fire and forget)
    if (eventType === 'pageview') {
      fetch(identityMatchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: visitorId,
          pixel_id: pixelId,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }),
        keepalive: true
      }).catch(function() { /* ignore errors */ });
    }
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
  
  // ========================================
  // FORM CONVERSION TRACKING HELPERS
  // ========================================
  
  // Track form submission with optional email extraction
  w.utmone.trackFormSubmit = function(eventType, formData) {
    eventType = eventType || 'lead';
    formData = formData || {};
    
    // If email is present, also identify the user for better attribution
    if (formData.email) {
      w.utmone.identify(formData.email, formData.name);
    }
    
    w.utmone.track(eventType, formData);
    console.log('[utm.one] Form conversion tracked:', eventType, formData);
  };
  
  // Track form step progress (for multi-step forms)
  w.utmone.trackFormStep = function(formName, stepNumber, totalSteps) {
    w.utmone.track('form_step', {
      form: formName,
      step: stepNumber,
      total_steps: totalSteps
    });
  };
  
  // Auto-detect form success patterns via DOM mutation observer
  w.utmone.enableAutoDetect = function(options) {
    options = options || {};
    
    var successPatterns = options.successPatterns || [
      /success/i,
      /thank\\s*you/i,
      /confirmed/i,
      /submitted/i,
      /complete/i,
      /received/i,
      /we.?ll\\s*(be\\s*in\\s*touch|contact\\s*you)/i,
      /journey\\s*starts/i
    ];
    
    var excludePatterns = options.excludePatterns || [
      /error/i,
      /failed/i,
      /invalid/i
    ];
    
    var debounceTime = options.debounce || 1000;
    var lastDetection = 0;
    var detected = false;
    
    var observer = new MutationObserver(function(mutations) {
      if (detected) return; // Only fire once per page
      
      var now = Date.now();
      if (now - lastDetection < debounceTime) return;
      
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType !== 1) return; // Only elements
          
          var text = node.textContent || '';
          if (text.length < 5 || text.length > 500) return; // Reasonable length
          
          // Check for exclude patterns first
          var hasExclude = excludePatterns.some(function(pattern) {
            return pattern.test(text);
          });
          if (hasExclude) return;
          
          // Check for success patterns
          var hasSuccess = successPatterns.some(function(pattern) {
            return pattern.test(text);
          });
          
          if (hasSuccess) {
            detected = true;
            lastDetection = now;
            
            w.utmone.track('lead', {
              auto_detected: true,
              success_text: text.substring(0, 100).trim()
            });
            
            console.log('[utm.one] Auto-detected form success:', text.substring(0, 50));
          }
        });
      });
    });
    
    observer.observe(d.body, {
      childList: true,
      subtree: true
    });
    
    console.log('[utm.one] Auto-detection enabled');
    return observer; // Return observer so it can be disconnected if needed
  };
  
  // Check URL for success indicators on page load
  function checkUrlForSuccess() {
    var hash = w.location.hash.toLowerCase();
    var params = new URLSearchParams(w.location.search);
    var path = w.location.pathname.toLowerCase();
    
    var successIndicators = [
      params.get('submitted') === 'true',
      params.get('success') === 'true',
      params.get('confirmed') === 'true',
      params.get('complete') === 'true',
      hash === '#success',
      hash === '#thank-you',
      hash === '#thankyou',
      hash === '#confirmed',
      hash === '#complete',
      path.includes('/thank-you'),
      path.includes('/thankyou'),
      path.includes('/confirmation'),
      path.includes('/success'),
      path.includes('/complete')
    ];
    
    if (successIndicators.some(Boolean)) {
      w.utmone.track('lead', {
        url_detected: true,
        detection_source: 'url'
      });
      console.log('[utm.one] URL-based conversion detected');
      return true;
    }
    return false;
  }
  
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
  
  // Check URL for success indicators after pageview (slight delay)
  setTimeout(checkUrlForSuccess, 100);
  
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
