

## Plan: Fix Page Auto-Refresh and Slow Loading

### Root Causes Identified

**1. `lazyWithRetry.ts` triggers automatic page reloads (line 93)**
When any lazy-loaded chunk fails to load (network hiccup, slow connection), the retry logic exhausts 3 attempts, then does `window.location.href = window.location.pathname + '?_t=' + timestamp` — a full page reload. On slow connections this creates a reload loop: load fails → reload → load fails again → shows fallback. This is the "auto refresh" you're seeing.

**2. Massive number of lazy imports in App.tsx (100+ routes)**
Every route is a separate lazy chunk. On initial load, Vite needs to resolve the route tree, and the browser fetches multiple chunks. With 100+ lazy imports declared at the top of App.tsx, the module resolution waterfall is slow. TTFB is 3.7s, FCP is 3.8s, LCP is 23s+ — all rated "poor".

**3. 20-second timeout in index.html shows "loading is taking longer than expected"**
When the app takes >20s to render (which happens with poor network + many chunks), the skeleton timeout fires and shows an error message with a "refresh page" button — contributing to the perception of broken refreshes.

### Fixes

**Step 1: Remove auto-reload from `lazyWithRetry.ts`**
- Remove the `window.location.href` redirect on line 93
- Instead, always show the `ModuleLoadErrorFallback` component after retries are exhausted (no reload)
- This stops the automatic page refresh loop entirely

**Step 2: Increase index.html skeleton timeout from 20s to 45s**
- The 20s timeout is too aggressive for slow connections loading many chunks
- Increase to 45s to avoid showing the error prematurely

**Step 3: Remove the cache-busting `?_t=` query parameter handling**
- The `sessionStorage.setItem('moduleReloadAttempted')` logic and the `?_t=timestamp` redirect are no longer needed once auto-reload is removed
- Keep the `sessionStorage.removeItem` on window load for cleanup of any existing flags

### Files Changed
- `src/utils/lazyWithRetry.ts` — Remove auto-reload, always show fallback on failure
- `index.html` — Increase timeout from 20s to 45s

### What this fixes
- No more unexpected page refreshes during normal use
- Failed chunk loads show a user-friendly error instead of reloading
- Slow connections get more time before seeing the timeout message

### What it doesn't change
- The lazy loading architecture stays the same (code-splitting is good)
- The retry logic with exponential backoff stays (retries are good)
- The fallback UI stays (graceful degradation is good)

