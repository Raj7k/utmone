# Lovable tasks — follow-up from profile + early-access audit

Two tasks, both independent. Paste each into Lovable chat one at a time.

The frontend code is already defensive (PGRST204 retry on profile update,
503 AI_UNAVAILABLE / EMAIL_UNAVAILABLE on missing secrets). These Lovable
tasks activate the full feature set; without them the app still works but
with reduced functionality.

---

## Task 1 — Add notification preference columns to `profiles`

The profile Settings page has toggles for email & in-app notifications
(link created, weekly digest, team invites, analytics milestones).
Those writes are silently dropped right now because the 5 columns don't
exist on the live `profiles` table.

Paste into Lovable:

> Please add 5 notification-preference columns to `public.profiles`.
> These are written by the Profile Settings page. All are nullable
> booleans with sensible defaults so existing rows are safe. Run this:
>
> ```sql
> ALTER TABLE public.profiles
>   ADD COLUMN IF NOT EXISTS notify_link_created BOOLEAN DEFAULT TRUE,
>   ADD COLUMN IF NOT EXISTS notify_weekly_digest BOOLEAN DEFAULT TRUE,
>   ADD COLUMN IF NOT EXISTS notify_team_invites BOOLEAN DEFAULT TRUE,
>   ADD COLUMN IF NOT EXISTS notify_analytics_milestones BOOLEAN DEFAULT TRUE,
>   ADD COLUMN IF NOT EXISTS notify_in_app BOOLEAN DEFAULT TRUE;
>
> -- Backfill: everyone is opted-in to all notifications by default.
> UPDATE public.profiles
> SET notify_link_created = COALESCE(notify_link_created, TRUE),
>     notify_weekly_digest = COALESCE(notify_weekly_digest, TRUE),
>     notify_team_invites = COALESCE(notify_team_invites, TRUE),
>     notify_analytics_milestones = COALESCE(notify_analytics_milestones, TRUE),
>     notify_in_app = COALESCE(notify_in_app, TRUE);
> ```
>
> Then verify with:
>
> ```sql
> SELECT column_name, data_type, column_default
> FROM information_schema.columns
> WHERE table_schema = 'public' AND table_name = 'profiles'
>   AND column_name LIKE 'notify_%';
> ```
>
> Should return 5 rows — one for each new column.

---

## Task 2 — Configure RESEND_API_KEY secret for email delivery

Early-access signup sends two emails via Resend:
- Welcome / confirmation email to the applicant (referral code + next steps)
- Approval email when admin approves (claim invite token)

Both functions now explicitly check for `RESEND_API_KEY` and return a
clean 503 with `code: "EMAIL_UNAVAILABLE"` if it's missing. Until the
secret is set, no emails go out.

Paste into Lovable:

> Please configure `RESEND_API_KEY` as a Supabase edge function secret
> so transactional emails actually get delivered. Then redeploy:
>
> - `send-applicant-confirmation` (sent to new early-access signups)
> - `send-approval-email`          (sent when admin approves an application)
> - `send-transactional-email`     (general template sender)
> - `send-drip-email`              (campaign drip sequences)
> - `send-weekly-waitlist-update`  (weekly status emails)
> - `send-status-update`           (operational updates)
> - `send-referral-unlock-email`   (referral milestone unlocks)
> - `send-hot-lead-alert`          (admin alert for high-scoring applicants)
> - `send-security-alert`          (MFA/login alerts)
> - `send-scheduled-report`        (analytics scheduled exports)
>
> Source a Resend API key at https://resend.com/api-keys (create one if
> needed), then add it to the Supabase project's edge function secrets.
>
> After setting, please test by invoking `send-applicant-confirmation`
> from the Functions UI with body:
> `{ "name": "Test", "email": "your-admin-email@domain.com", "team_size": "1-10", "referral_code": "test123", "request_id": "test" }`
> — an email should actually arrive (or Resend returns a clear error).

---

## Task 3 (optional, small) — Add admin notification on new early-access signup

Currently no admin is pinged when someone signs up. The early-access flow
creates a row in `early_access_requests` and sends the applicant their
confirmation, but no one on your team knows there's a new applicant to
review.

Paste into Lovable:

> Please add an admin notification step to the early-access signup flow.
> Simplest approach: inside the existing `handle-referral-signup` edge
> function (supabase/functions/handle-referral-signup/index.ts), after
> the successful insert into `early_access_requests`, call
> `send-transactional-email` with a template like `admin-new-signup` or
> a simple hardcoded body. Destination should be an admin email from
> an `ADMIN_NOTIFICATION_EMAIL` env var (set that as a secret — e.g.
> `myselfrajnishkumar@gmail.com`). Include: applicant name, email,
> team size, referral code, link to `/admin/waitlist` for review.
>
> If you'd rather route this through the existing Slack integration
> instead of email, call `slack-integration` with a payload describing
> the new applicant. Either approach is fine.
>
> Either way, fire-and-forget — don't block the signup response on
> whether the admin notification succeeded.

---

## Reference

After Task 1 and Task 2 are done:
- Profile Settings notification toggles actually persist
- Early-access signups receive welcome + approval emails
- Task 3 (admin notification) is optional but recommended for knowing
  when to approve new applicants
