# Conversion Tracking API

Track conversions (leads, signups, purchases) from your short links to measure ROI and campaign effectiveness.

## Quick Start

```javascript
// Track a conversion event
fetch('https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/track-conversion', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    link_id: 'your-link-uuid',
    event_type: 'purchase',
    event_value: 99.99,
    currency: 'USD',
    user_identifier: 'user@example.com'
  })
})
```

## Event Types

- **`lead`** - User submitted contact form or showed interest
- **`signup`** - User created an account or signed up
- **`purchase`** - User completed a purchase
- **`custom`** - Custom event with optional `event_name`

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `link_id` | string (UUID) | ✅ | The short link ID to attribute conversion to |
| `event_type` | string | ✅ | One of: `lead`, `signup`, `purchase`, `custom` |
| `event_name` | string | ❌ | Custom name for event (used with `custom` type) |
| `event_value` | number | ❌ | Revenue amount for purchase events |
| `currency` | string | ❌ | Currency code (default: `USD`) |
| `user_identifier` | string | ❌ | Email, user ID, or identifier for attribution |
| `click_id` | string (UUID) | ❌ | Specific click ID if known |
| `metadata` | object | ❌ | Additional custom data as JSON object |

## Attribution Window

- Conversions are automatically attributed to the most recent click within **30 days**
- If `click_id` is provided, conversion is attributed directly to that click
- If `user_identifier` is provided, system attempts to match to recent clicks

## Example: Track Purchase

```javascript
// When user completes checkout
const trackPurchase = async (linkId, orderValue) => {
  await fetch('https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/track-conversion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      link_id: linkId,
      event_type: 'purchase',
      event_value: orderValue,
      currency: 'USD',
      user_identifier: currentUser.email,
      metadata: {
        order_id: '12345',
        product: 'Pro Plan',
        payment_method: 'stripe'
      }
    })
  });
};
```

## Example: Track Lead

```javascript
// When user submits contact form
const trackLead = async (linkId, email) => {
  await fetch('https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/track-conversion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      link_id: linkId,
      event_type: 'lead',
      user_identifier: email,
      metadata: {
        source: 'contact_form',
        interest: 'enterprise_demo'
      }
    })
  });
};
```

## Example: Track Signup

```javascript
// When user creates account
const trackSignup = async (linkId, userId) => {
  await fetch('https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/track-conversion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      link_id: linkId,
      event_type: 'signup',
      user_identifier: userId,
      metadata: {
        signup_method: 'google_oauth',
        plan: 'free'
      }
    })
  });
};
```

## Client-Side Implementation

### React Example

```jsx
import { useState, useEffect } from 'react';

// Get link_id from URL parameter
const CheckoutPage = () => {
  const [linkId, setLinkId] = useState(null);

  useEffect(() => {
    // Extract link_id from URL params or localStorage
    const params = new URLSearchParams(window.location.search);
    const id = params.get('utm_content') || localStorage.getItem('last_link_id');
    setLinkId(id);
  }, []);

  const handlePurchase = async (amount) => {
    if (linkId) {
      // Track conversion
      await fetch('https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/track-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link_id: linkId,
          event_type: 'purchase',
          event_value: amount,
          user_identifier: currentUser.email
        })
      });
    }
    
    // Continue with checkout...
  };

  return <button onClick={() => handlePurchase(99.99)}>Buy Now</button>;
};
```

## Viewing Conversion Data

### In the Dashboard

1. Go to **Analytics** → **Conversions** tab
2. View conversion funnel: Clicks → Leads → Signups → Purchases
3. See conversion rate, average order value, and total revenue

### Per-Link Analytics

1. Go to **Links** → Click on a specific link
2. Navigate to **Analytics** → **Conversions** tab
3. View conversion metrics specific to that link

## Response Format

### Success (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "link_id": "uuid",
    "event_type": "purchase",
    "event_value": 99.99,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Conversion tracked successfully"
}
```

### Error (400 Bad Request)
```json
{
  "error": "Missing required fields: link_id and event_type are required"
}
```

### Error (404 Not Found)
```json
{
  "error": "Link not found or invalid link_id"
}
```

## Best Practices

1. **Pass link_id through the funnel**: Store link_id in URL params, cookies, or localStorage to ensure proper attribution
2. **Use user_identifier**: Helps with multi-session attribution and deduplication
3. **Track early and often**: Track leads early in the funnel, not just final purchases
4. **Include metadata**: Additional context helps with analysis and debugging
5. **Handle errors gracefully**: Conversion tracking should never block user experience

## Privacy & Compliance

- All conversion data is stored securely and scoped to your workspace
- Only workspace members can view conversion data
- Consider user consent requirements (GDPR, CCPA) before tracking
- User identifiers are not exposed in public APIs

## Rate Limits

- No rate limits on conversion tracking endpoint
- Designed for high-volume production use
- Automatic deduplication prevents double-counting

## Troubleshooting

### Conversions not showing up?

1. Verify `link_id` is valid UUID
2. Check that link exists and belongs to your workspace
3. Ensure Content-Type header is set to `application/json`
4. Check browser console for API errors

### Attribution not working?

1. Verify clicks were tracked within 30-day window
2. Ensure `user_identifier` matches between click and conversion
3. Check that cookies/localStorage are enabled
4. Use `click_id` for direct attribution if available
