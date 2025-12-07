// utm.one Tracking Pixel v2.0
(function() {
  'use strict';
  
  // Configuration
  const COOKIE_NAME = 'utm_vid';
  const COOKIE_DAYS = 30;
  const API_ENDPOINT = 'https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/track-event';
  
  // Utility: Get cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  // Utility: Set cookie
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }
  
  // Utility: Generate visitor ID
  function generateVisitorId() {
    return 'vid_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
  
  // Utility: Get URL parameters
  function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // Get or create visitor ID
  function getVisitorId() {
    // Check URL parameter first (from short link)
    let vid = getUrlParam('utm_vid');
    
    if (vid) {
      setCookie(COOKIE_NAME, vid, COOKIE_DAYS);
      return vid;
    }
    
    // Check cookie
    vid = getCookie(COOKIE_NAME);
    
    if (!vid) {
      // Generate new ID
      vid = generateVisitorId();
      setCookie(COOKIE_NAME, vid, COOKIE_DAYS);
    }
    
    return vid;
  }
  
  // Send tracking event
  function sendEvent(eventType, data) {
    const visitorId = getVisitorId();
    
    // Extract revenue/value for standardization
    let revenue = null;
    let currency = 'USD';
    
    if (data) {
      // Check for revenue or value fields and normalize
      if (typeof data.revenue === 'number') {
        revenue = data.revenue;
      } else if (typeof data.value === 'number') {
        revenue = data.value;
      } else if (typeof data.revenue === 'string') {
        revenue = parseFloat(data.revenue) || null;
      } else if (typeof data.value === 'string') {
        revenue = parseFloat(data.value) || null;
      }
      
      // Extract currency if provided
      if (data.currency && typeof data.currency === 'string') {
        currency = data.currency.toUpperCase();
      }
    }
    
    const payload = {
      visitor_id: visitorId,
      event_type: eventType,
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      revenue: revenue,
      currency: currency,
      ...data
    };
    
    // Log for debugging
    console.log('[utm.one] Tracking:', eventType, payload);
    
    // Use sendBeacon if available (more reliable for page unload)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(API_ENDPOINT, blob);
    } else {
      // Fallback to fetch
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function(err) {
        console.error('[utm.one] Tracking error:', err);
      });
    }
    
    return { success: true, visitor_id: visitorId, event: eventType };
  }
  
  // Track pageview on load
  function trackPageview() {
    sendEvent('pageview', {
      utm_source: getUrlParam('utm_source'),
      utm_medium: getUrlParam('utm_medium'),
      utm_campaign: getUrlParam('utm_campaign'),
      utm_term: getUrlParam('utm_term'),
      utm_content: getUrlParam('utm_content')
    });
  }
  
  // Identity resolution function
  function identify(email, additionalData) {
    if (!email || typeof email !== 'string') {
      console.error('[utm.one] identify: email is required');
      return;
    }
    
    sendEvent('identify', {
      email: email.toLowerCase().trim(),
      ...additionalData
    });
  }
  
  // Custom event tracking function (for revenue, conversions, etc.)
  function track(eventName, metadata) {
    if (!eventName || typeof eventName !== 'string') {
      console.error('[utm.one] track: eventName is required');
      return { success: false, error: 'eventName is required' };
    }
    
    return sendEvent(eventName, {
      event_name: eventName,
      ...metadata
    });
  }
  
  // Auto-capture form submissions (no-code listener)
  function setupFormListener() {
    document.addEventListener('submit', function(e) {
      const form = e.target;
      
      // Find email input
      const emailInput = form.querySelector('input[type="email"]') || 
                         form.querySelector('input[name*="email" i]');
      
      if (emailInput && emailInput.value) {
        identify(emailInput.value, {
          form_id: form.id || null,
          form_action: form.action || null,
          auto_captured: true
        });
      }
    });
  }
  
  // Expose global API
  window.utm = window.utm || {};
  window.utm.identify = identify;
  window.utm.track = track;
  window.utm.getVisitorId = getVisitorId;
  
  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      trackPageview();
      setupFormListener();
    });
  } else {
    trackPageview();
    setupFormListener();
  }
  
  console.log('[utm.one] Pixel v2.0 initialized. Visitor ID:', getVisitorId());
})();
