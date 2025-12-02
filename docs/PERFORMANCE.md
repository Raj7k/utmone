# Algorithmic Performance Optimizations

This document describes the advanced performance optimizations implemented in utm.one, based on algorithms from academic textbooks on optimization and decision theory.

## 1. Markovian Prefetching (Predictive Loading)

**Source:** *Algorithms for Decision Making*, Chapter 2 (Probabilistic Models)

**Problem:** Traditional page loading waits for clicks, resulting in 100ms+ latency.

**Solution:** Model user navigation as a Markov Chain to predict the next page before it's clicked.

### Implementation: `useIntentPrefetch` Hook

```typescript
import { useIntentPrefetch } from '@/hooks/useIntentPrefetch';

function App() {
  // Automatically enables hover-based prefetching
  useIntentPrefetch({
    hoverDelay: 50,        // Prefetch after 50ms hover
    maxConcurrent: 3,      // Max 3 simultaneous prefetches
    respectSaveData: true, // Honor user's data saver preference
  });
  
  return <YourApp />;
}
```

### How It Works

1. **State Transition Model**: When user hovers a link for >50ms, we infer high probability (P≈0.9) they will click
2. **Prefetch Action**: Inject `<link rel="prefetch">` to load page in background
3. **Result**: When click occurs, page loads instantly (0ms perceived latency)

### Network Awareness

- Respects `navigator.connection.saveData` flag
- Limits concurrent prefetches to avoid bandwidth saturation
- Cancels prefetch if user moves away quickly (hover <50ms)

## 2. Pareto-Optimal Media Loading

**Source:** *Algorithms for Optimization*, Chapter 15 (Multiobjective Optimization)

**Problem:** Serving 4K images to mobile users on 3G is Pareto inefficient (high cost, no benefit).

**Solution:** Find the efficient frontier between quality and bandwidth.

### Implementation: `SmartImage` Component

```tsx
import { SmartImage } from '@/components/ui/smart-image';

<SmartImage
  src="/images/hero-desktop.jpg"      // High-quality desktop image
  mobileSrc="/images/hero-mobile.jpg" // Optimized mobile image
  blurDataURL="data:image/jpeg;base64,..." // Tiny blur placeholder
  alt="Hero image"
  aspectRatio="16/9"
  useWebP={true}
/>
```

### Adaptive Quality Selection

The component automatically selects optimal image based on:

| Condition | Action |
|-----------|--------|
| `connection.saveData === true` | Load mobile version (regardless of screen size) |
| `effectiveType === '2g' or 'slow-2g'` | Load smallest available version |
| `effectiveType === '3g'` | Load mobile version on mobile, standard on desktop |
| `effectiveType === '4g' or 'wifi'` | Load highest quality (WebP if supported) |

### Blur-Up Technique

1. **Instant render**: Display tiny base64 placeholder (blur-sm)
2. **Background load**: Fetch optimal image based on network
3. **Smooth transition**: Fade in real image (300ms opacity transition)
4. **Result**: Perceived load time ≈ 0ms

## 3. Knapsack Asset Strategy (Critical CSS)

**Source:** *Algorithms for Optimization*, Chapter 22 (Discrete Optimization)

**Problem:** Browser cache is finite (like a knapsack), but we load too many low-value assets.

**Solution:** Solve 0/1 Knapsack Problem - only cache assets where Value/Weight ratio is optimal.

### Implementation Strategy

#### Phase 1: Critical CSS Inlining (Build Time)

**Vite Plugin Configuration:**

```typescript
// vite.config.ts
import { critical } from 'vite-plugin-critical';

export default defineConfig({
  plugins: [
    critical({
      inline: true,
      minify: true,
      extract: true,
      dimensions: [
        { width: 375, height: 667 },  // Mobile
        { width: 1920, height: 1080 }, // Desktop
      ],
    }),
  ],
});
```

This extracts "above the fold" CSS and inlines it into `<head>`, deferring the rest.

#### Phase 2: Dynamic Inlining (Route-Based)

**Concept:** Inline critical CSS based on entry point.

```typescript
// Entry via /blog -> inline blog CSS
// Entry via /pricing -> inline pricing CSS
```

**To Implement:** Use Vite's `rollupOptions.manualChunks` to split CSS by route.

### JavaScript Deferral

All non-critical scripts should use `defer`:

```html
<script src="/app.js" defer></script>
```

Or for Next.js:

```tsx
<Script src="/analytics.js" strategy="afterInteractive" />
```

## 4. Resource Hints (Preconnect & DNS Prefetch)

### Implemented in `PerformanceProvider`

```typescript
// Automatically injected
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
```

**Effect:** Eliminates DNS lookup (20-50ms) and TCP handshake (50-100ms) for critical origins.

## 5. Code Splitting (Lasso Regularization)

**Source:** *Algorithms for Optimization*, Chapter 11 (Regularization)

**Concept:** Apply L1 penalty (Lasso) to bundles - force unused code coefficients to zero.

### Current Implementation

```typescript
// Each route is lazily loaded
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### Bundle Budget Enforcement

**CI/CD Check:**

```json
{
  "budgets": [
    {
      "type": "bundle",
      "name": "main",
      "maximumSize": "100kb"
    }
  ]
}
```

**Rule:** If main bundle exceeds 100KB, build fails - forcing optimization.

## Performance Targets (Lighthouse)

After implementing these optimizations, aim for:

| Metric | Target | Current |
|--------|--------|---------|
| **First Contentful Paint (FCP)** | < 0.8s | TBD |
| **Largest Contentful Paint (LCP)** | < 1.2s | TBD |
| **Time to Interactive (TTI)** | < 1.5s | TBD |
| **Cumulative Layout Shift (CLS)** | = 0 | TBD |
| **Total Blocking Time (TBT)** | < 100ms | TBD |

## Usage Instructions

### 1. Enable Global Optimizations

Wrap your app with `PerformanceProvider`:

```tsx
// main.tsx or App.tsx
import { PerformanceProvider } from '@/components/performance/PerformanceProvider';

root.render(
  <PerformanceProvider>
    <App />
  </PerformanceProvider>
);
```

### 2. Replace Standard Images with SmartImage

Before:
```tsx
<img src="/hero.jpg" alt="Hero" />
```

After:
```tsx
<SmartImage
  src="/hero.jpg"
  mobileSrc="/hero-mobile.jpg"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."
  alt="Hero"
/>
```

### 3. Monitor Performance

In development mode, `PerformanceProvider` logs metrics to console:

```
🚀 Performance Metrics:
  DNS Lookup: 8.40ms
  TCP Connect: 12.30ms
  TTFB: 45.20ms
  DOM Content Loaded: 120.50ms
  Load Complete: 180.30ms
  Total Load Time: 246.20ms
```

## Advanced: Custom Prefetch Strategies

You can manually control prefetching:

```typescript
const { prefetch, isPrefetched } = useIntentPrefetch();

// Manually prefetch a route
prefetch('/pricing');

// Check if already prefetched
if (!isPrefetched('/dashboard')) {
  prefetch('/dashboard');
}
```

## References

1. Kochenderfer, M., Wheeler, T., & Wray, K. (2022). *Algorithms for Decision Making*. MIT Press.
2. Kochenderfer, M., & Wheeler, T. (2019). *Algorithms for Optimization*. MIT Press.
3. Markov Decision Processes (MDPs) for Navigation Prediction
4. Pareto Efficiency in Resource Allocation
5. 0/1 Knapsack Problem for Cache Optimization
