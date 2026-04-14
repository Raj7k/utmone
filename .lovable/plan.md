

## Plan: Add Transactional Emails (Demo Confirmation + Early Access Welcome)

### What
Set up app email infrastructure and create two confirmation email templates that send automatically when users submit the Book Demo or Early Access forms.

### Email Templates

**1. Demo Request Confirmation** (`demo-confirmation`)
- Triggered after Book Demo form submission
- Confirms their request was received, reminds them to book via Cal.com link
- Branded with utm.one obsidian theme (white background, dark accents)

**2. Early Access Welcome** (`early-access-welcome`)
- Triggered after Early Access form submission
- Welcomes the user, shows their queue position, includes referral code
- Encourages sharing their referral link

### Steps

1. **Scaffold transactional email infrastructure** — creates `send-transactional-email`, `handle-email-unsubscribe`, and `handle-email-suppression` edge functions, plus the template registry
2. **Create two email templates** in `supabase/functions/_shared/transactional-email-templates/`:
   - `demo-confirmation.tsx` — "thanks for booking" with Cal.com CTA
   - `early-access-welcome.tsx` — welcome with queue position and referral code
3. **Register templates** in `registry.ts`
4. **Create unsubscribe page** at the path determined by the scaffold tool
5. **Wire up triggers**:
   - `src/pages/BookDemo.tsx` — add `supabase.functions.invoke('send-transactional-email', ...)` after successful `demo_requests` insert
   - `src/components/early-access/EarlyAccessStepForm.tsx` — add email send after successful `handle-referral-signup` response
6. **Deploy all edge functions**

### Files Modified
- `supabase/functions/_shared/transactional-email-templates/demo-confirmation.tsx` (new)
- `supabase/functions/_shared/transactional-email-templates/early-access-welcome.tsx` (new)
- `supabase/functions/_shared/transactional-email-templates/registry.ts` (new/updated)
- `supabase/functions/send-transactional-email/index.ts` (scaffolded)
- `supabase/functions/handle-email-unsubscribe/index.ts` (scaffolded)
- `supabase/functions/handle-email-suppression/index.ts` (scaffolded)
- `src/pages/BookDemo.tsx` — add email send after form submit
- `src/components/early-access/EarlyAccessStepForm.tsx` — add email send after signup
- `src/pages/Unsubscribe.tsx` (new) — branded unsubscribe page

