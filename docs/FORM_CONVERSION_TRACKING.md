# Form Conversion Tracking Guide

Track form submissions and conversions **even without thank-you page redirects**. This guide covers multiple approaches for different form implementations.

## The Problem

Many modern forms (especially SPA/AJAX forms) show inline success messages instead of redirecting to thank-you pages. Without explicit tracking code, these conversions go unrecorded.

**Example:** Keka.com signup form shows "Great move—your journey starts now" inline without any page change.

---

## Solution Methods

### Method 1: Manual Tracking (Recommended)

Add tracking code after your form's success handler. Most reliable approach.

```javascript
// Basic form conversion
utmone.trackFormSubmit('lead', {
  form: 'signup-form',
  source: 'landing-page'
});

// With email for cross-device attribution
utmone.trackFormSubmit('lead', {
  form: 'contact-form',
  email: userEmail,
  name: userName
});
```

**React Example:**
```jsx
const handleSubmit = async (data) => {
  try {
    await submitForm(data);
    
    // Track successful conversion
    window.utmone.trackFormSubmit('lead', {
      form: 'demo-request',
      email: data.email
    });
    
    setSuccess(true);
  } catch (error) {
    // Don't track on error
    setError(error.message);
  }
};
```

---

### Method 2: Auto-Detection Mode

Enable DOM mutation observer to automatically detect success patterns appearing on the page.

```javascript
// Basic auto-detection
utmone.enableAutoDetect();

// With custom patterns
utmone.enableAutoDetect({
  successPatterns: [
    /success/i,
    /thank you/i,
    /confirmed/i,
    /submitted/i,
    /your journey starts/i,
    /we'll be in touch/i
  ],
  excludePatterns: [
    /error/i,
    /failed/i
  ],
  debounce: 1000 // Prevent duplicate detections
});
```

**Detected automatically:**
- "Success"
- "Thank you"
- "Confirmed"
- "Submitted"
- "Complete"
- "Received"
- "We'll be in touch"
- "Journey starts"

---

### Method 3: Multi-Step Form Tracking

Track progress through multi-step forms to identify drop-off points.

```javascript
// Track each step
utmone.trackFormStep('signup', 1, 3); // Starting step 1 of 3
utmone.trackFormStep('signup', 2, 3); // Completed step 1, on step 2
utmone.trackFormStep('signup', 3, 3); // Completed step 2, on step 3

// Track final completion
utmone.trackFormSubmit('lead', {
  form: 'signup',
  total_steps_completed: 3
});
```

---

### Method 4: URL-Based Detection (Automatic)

The pixel automatically tracks conversions when it detects success indicators in URLs:

**Query Parameters:**
- `?submitted=true`
- `?success=true`
- `?confirmed=true`
- `?complete=true`

**Hash Fragments:**
- `#success`
- `#thank-you`
- `#confirmed`

**URL Paths:**
- `/thank-you`
- `/confirmation`
- `/success`

No code changes needed—just ensure your form redirects include these patterns.

---

### Method 5: Fetch/XHR Interception (Advanced)

Intercept network requests to detect successful API responses.

```javascript
// Intercept fetch requests
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const response = await originalFetch.apply(this, args);
  
  // Check if form submission endpoint returned success
  const url = typeof args[0] === 'string' ? args[0] : args[0].url;
  if (url.includes('/api/submit') && response.ok) {
    utmone.trackFormSubmit('lead', {
      form: 'ajax-form',
      endpoint: url
    });
  }
  
  return response;
};
```

---

## Event Types

| Event Type | Description | When to Use |
|------------|-------------|-------------|
| `lead` | Form converted to lead | Contact forms, demo requests, signups |
| `signup` | Account created | Registration forms |
| `form_start` | User began filling form | Optional, for funnel analysis |
| `form_step` | User completed a step | Multi-step forms |
| `form_submit` | Form submitted (pre-validation) | Debug purposes |
| `purchase` | Conversion with revenue | E-commerce, payments |

---

## Best Practices

1. **Track after success, not on submit**
   - Wait for API response confirmation
   - Don't track on validation errors

2. **Pass email when available**
   - Enables cross-device attribution
   - Links anonymous visitors to known users

3. **Use descriptive form names**
   - `'homepage-demo-request'` > `'form1'`
   - Helps identify conversion sources

4. **Test before deploying**
   - Open browser console
   - Look for `[utm.one] Form conversion tracked` logs

---

## Troubleshooting

### Conversion not showing?

1. **Check console logs** - Look for `[utm.one]` messages
2. **Verify pixel loaded** - `window.utmone` should exist
3. **Check timing** - Track AFTER success, not before
4. **Verify domain whitelist** - If configured, ensure domain is allowed

### Duplicate conversions?

1. **Add debouncing** - Use `debounce` option in auto-detect
2. **Track once per session** - Store flag in sessionStorage
3. **Check for page refreshes** - Prevent re-tracking on refresh

```javascript
// Prevent duplicate tracking
if (!sessionStorage.getItem('form_tracked')) {
  utmone.trackFormSubmit('lead', { form: 'signup' });
  sessionStorage.setItem('form_tracked', 'true');
}
```
