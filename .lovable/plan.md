

## Plan: Fix "slug unavailable" false positive after link creation

### Problem
After successfully creating a link, the slug availability `useEffect` (line 140) re-fires because the form still contains the slug value. It queries the database, finds the just-created link, and marks the slug as "unavailable" — showing a confusing error toast alongside the success message.

### Root Cause
The `shortURL` state is set on success (line 206), but the slug-check `useEffect` doesn't skip when a link has already been created. It keeps checking even after creation succeeds.

### Fix

**`src/components/tools/URLShortenerTool.tsx`** — two changes:

1. **Guard the slug-check useEffect** (line 140-156): Skip the check when `shortURL` is already set (meaning a link was just created):
   ```typescript
   useEffect(() => {
     const checkSlug = async () => {
       if (shortURL) return; // Link already created, skip check
       if (values.slug && values.slug.length >= 3) {
         // ...existing check
       }
     };
     // ...
   }, [values.slug, selectedDomain, shortURL]);
   ```

2. **Reset `slugAvailable` on success** (inside `onSuccess` at line 203): Set `setSlugAvailable(null)` so the form doesn't show stale "unavailable" state if the user creates another link.

### Files Modified
- `src/components/tools/URLShortenerTool.tsx` (2 small edits)

