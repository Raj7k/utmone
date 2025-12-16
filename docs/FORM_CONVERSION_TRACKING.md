# Form Conversion Tracking Guide

Track form submissions and conversions **even without thank-you page redirects**. This guide covers multiple approaches for different form implementations.

## The Problem

Many modern forms (especially single-page apps) show inline "success" messages instead of redirecting to thank-you pages. Without tracking code, these conversions go unrecorded.

**Example:** A signup form shows "Great move—your journey starts now" without any page change.

---

## Quick Start (30 seconds)

Add this code after your form submits successfully:

```javascript
// After form submission succeeds
utmone('track', 'lead', { revenue: 0 });
```

That's it! You're tracking form submissions.

---

## What Value Should I Use?

This is the most common question. Here's a simple guide:

| What you're tracking | What value to use | Example |
|---------------------|-------------------|---------|
| 🛒 **E-commerce purchase** | The order total | `{ revenue: 149.99 }` |
| 📝 **Contact form / Demo request** | Your average deal size, OR $0 | `{ revenue: 5000 }` or `{ revenue: 0 }` |
| 👤 **Free signup** | $0 | `{ revenue: 0 }` |
| 👤 **Paid signup** | The plan price | `{ revenue: 29 }` |
| 🎯 **Download / Other goal** | $0 or estimated value | `{ revenue: 0 }` |

### Don't know your lead value?

Use this simple formula:

```
Lead Value = (Conversion Rate %) × (Average Deal Size)

Example: 10% of leads become customers × $5,000 avg deal = $500 per lead
```

**Or just use $0** — you can always add value later. Tracking conversions without value is better than not tracking at all!

---

## Solution Methods

### Method 1: Manual Tracking (Recommended)

Add tracking code after your form's success handler. Most reliable approach.

```javascript
// Basic form conversion (no value)
utmone('track', 'lead', { revenue: 0 });

// With estimated lead value
utmone('track', 'lead', { revenue: 500 });

// With email for better attribution
utmone('identify', userEmail, userName);
utmone('track', 'lead', { revenue: 500 });
```

**React Example:**
```jsx
const handleSubmit = async (data) => {
  try {
    await submitForm(data);
    
    // Track successful conversion
    window.utmone('identify', data.email, data.name);
    window.utmone('track', 'lead', { revenue: 500 });
    
    setSuccess(true);
  } catch (error) {
    // Don't track on error
    setError(error.message);
  }
};
```

---

### Method 2: Auto-Detection Mode

Automatically detects when "success" or "thank you" messages appear on the page.

```javascript
// Enable auto-detection (looks for common success messages)
utmone.enableAutoDetect();

// With custom patterns (optional)
utmone.enableAutoDetect({
  successPatterns: [
    /success/i,
    /thank you/i,
    /confirmed/i,
    /we'll be in touch/i
  ],
  debounce: 1000 // Prevents counting twice
});
```

**Messages detected automatically:**
- "Success", "Thank you", "Confirmed", "Submitted", "Complete", "We'll be in touch"

---

### Method 3: Multi-Step Form Tracking

Track progress through multi-step forms to see where users drop off.

```javascript
// Track each step
utmone('track', 'form_step', { form: 'signup', step: 1, total: 3 });
utmone('track', 'form_step', { form: 'signup', step: 2, total: 3 });
utmone('track', 'form_step', { form: 'signup', step: 3, total: 3 });

// Track final completion
utmone('track', 'lead', { form_name: 'signup' });
```

---

### Method 4: URL-Based Detection (Automatic)

The pixel automatically tracks when it sees success indicators in URLs:

- `?success=true` or `?submitted=true`
- `#thank-you` or `#success`
- `/thank-you` or `/confirmation` pages

No code needed — just ensure your form redirects include these patterns.

---

## Event Types

| Event | When to Use | Example Value |
|-------|-------------|---------------|
| 🛒 `purchase` | Someone paid you money | Order total ($99.99) |
| 📝 `lead` | Form submission | Estimated deal value ($500) or $0 |
| 👤 `signup` | Account created | Plan price or $0 for free |
| 🎯 `trial_start` | Free trial began | Expected conversion value |

---

## Best Practices

1. **Track after success, not on submit** — Wait for the API to confirm success
2. **Pass email when available** — Helps link visitors across devices
3. **Use descriptive form names** — `'homepage-demo'` is better than `'form1'`
4. **Test before deploying** — Check browser console for `[utm.one]` messages

---

## Troubleshooting

### Conversion not showing?

1. **Check console** — Look for `[utm.one]` messages
2. **Verify pixel loaded** — Type `window.utmone` in console (should exist)
3. **Check timing** — Make sure you track AFTER the form succeeds

### Seeing duplicate conversions?

Add this to track only once per session:

```javascript
if (!sessionStorage.getItem('form_tracked')) {
  utmone('track', 'lead', { revenue: 0 });
  sessionStorage.setItem('form_tracked', 'true');
}
```

---

## FAQ

### Q: What if I don't know my average deal size?
**A:** Use $0 for now. You can update your tracking code anytime. Counting conversions without value is better than not counting at all.

### Q: Should I track every form on my site?
**A:** Track forms that represent meaningful conversions — contact forms, demo requests, signups. Skip things like search forms or newsletter signups (unless newsletters are your goal).

### Q: Can I change the value later?
**A:** Yes! Just update the `revenue` value in your tracking code and redeploy. Historical data keeps its original values.

### Q: What currency is used?
**A:** USD by default. All values should be in USD for consistent reporting.
