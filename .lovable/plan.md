

## Plan: Fix QR Code Generation "No input text" Error

### Problem
When generating a QR code, the error "Generation Failed — No input text" appears because `link.short_url` is `null` in the database, so `""` is passed to the QR code library which requires non-empty input. Additionally, the `normalizeUrl` helper in `QRCodeGenerator.tsx` hardcodes an old Supabase project URL (`whgnsmjdubnvbmarnjfx.supabase.co`).

### Changes

**1. `src/pages/dashboard/QRCodes.tsx`** — Construct a fallback short URL from `slug` and `domain` when `short_url` is null:
- Line 242: Change `link.short_url || ""` to `link.short_url || \`https://\${link.domain}/\${link.slug}\``
- Line 290: Same fix for the second click handler

**2. `src/components/QRCodeGenerator.tsx`** — Two fixes:
- Replace the hardcoded old Supabase URL in both `normalizeUrl` functions (lines 71-78 and 217-225) with `import.meta.env.VITE_SUPABASE_URL`
- Add an early guard: if `shortUrl` is empty after normalization, throw a descriptive error before calling `QRCodeLib.toDataURL`

### Files Modified
- `src/pages/dashboard/QRCodes.tsx` (2 lines)
- `src/components/QRCodeGenerator.tsx` (update normalizeUrl + add guard)

