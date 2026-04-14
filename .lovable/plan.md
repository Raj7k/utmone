

## Plan: Unhide the GTM Insights 2026 Page

The full GTM Insights 2026 page already exists at `src/pages/resources/reports/GTMInsights2026.tsx` and is already lazy-imported in `App.tsx` (line 215). The route just needs to use it instead of the `ComingSoonPage` placeholder.

### Changes

**1. `src/App.tsx` — Swap route element (lines 863-871)**
Replace the `ComingSoonPage` with `<GTMInsights2026 />` for the `/resources/reports/gtm-insights-2026` route.

**2. `src/components/landing/Footer.tsx` — Remove "comingSoon" tag (line 56)**
Remove `comingSoon: true` from the GTM Insights link.

**3. `src/components/landing/ResourcesFooter.tsx` — Remove "comingSoon" tag (line 56)**
Same change in the resources footer.

No other files need changes — the navigation, mega dropdown, and showcase card already link to the correct URL.

