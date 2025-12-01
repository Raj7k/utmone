# LLM Optimization Framework Implementation

## Overview
Complete implementation of machine-readable architecture across utm.one to ensure AI agents (ChatGPT, Perplexity, Google SGE) can accurately discover, understand, and cite our platform.

## Phase 1: Semantic Spine ✅

### Components Created
- **`MainLayout.tsx`**: Root layout component with semantic HTML structure
  - Uses `<header>`, `<main>`, `<footer>` tags with proper ARIA roles
  - Enforces single `<h1>` rule per page
  - Integrates Navigation, AnnouncementBar, and SemanticFooter

- **`SemanticFooter.tsx`**: Structured footer with navigation sections
  - Four semantic `<nav>` regions (Product, Resources, Company, Legal)
  - Dynamic freshness timestamp (Last Updated: [Month] [Year])
  - Proper ARIA labels for screen readers

### Implementation Status
- ✅ Semantic HTML tags (`<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<section>`)
- ✅ Single H1 enforcement
- ✅ ARIA roles and labels
- ✅ Keyboard navigation support

## Phase 2: Data Layer (Schema Generator) ✅

### Components Created
- **`LLMSchemaGenerator.tsx`**: Dynamic JSON-LD schema injection
  - **Organization Schema**: Company info, contact points, social links
  - **Article Schema**: Blog posts with author, publisher, dates
  - **HowTo Schema**: Step-by-step guides with structured steps
  - **Software Application Schema**: Product info, pricing, ratings
  - **Pricing Schema**: Plan details with structured offers
  - **FAQ Schema**: Question/answer pairs

### Usage Examples
```tsx
// Homepage
<LLMSchemaGenerator type="organization" data={{}} />

// Blog Post
<LLMSchemaGenerator 
  type="article" 
  data={{
    title: "How to Build Better Links",
    description: "...",
    publishedDate: "2025-01-15",
    url: "https://utm.one/blog/better-links"
  }} 
/>

// Feature Page
<LLMSchemaGenerator type="software" data={{}} />
```

## Phase 3: Knowledge Hooks ✅

### Components Created
- **`GlossaryTooltip.tsx`**: Inline term definitions with hover tooltips
  - 15 pre-defined glossary terms:
    - utm parameters
    - link rot
    - qr density
    - clean-track
    - semantic slug
    - contextual routing
    - link health
    - attribution journey
    - rls policy
    - edge function
    - workspace isolation
    - smart rotation
    - thompson sampling
    - pareto frontier
    - gaussian process
  
- **Usage**: Wrap technical terms in `<GlossaryTooltip>` for instant definitions

```tsx
import { GlossaryTooltip } from "@/components/llm/GlossaryTooltip";

<p>
  Use <GlossaryTooltip term="utm parameters" inline /> to track campaigns.
</p>
```

### Content Injection (To Be Applied)
- [ ] Add TL;DR blocks to blog posts
- [ ] Auto-inject FAQ sections on feature pages
- [ ] Create `/docs` public documentation route

## Phase 4: Accessibility (Text-First Fallbacks) ✅

### Components Created
- **`ChartWrapper.tsx`**: Enhanced with screen reader tables
  - Wraps all Recharts visualizations
  - Generates `<table class="sr-only">` with raw data
  - Provides full chart data to assistive technologies

- **`useChartAccessibility.ts`**: Accessibility data transformation hooks
  - `useChartAccessibility()`: For line/bar charts (multi-series)
  - `usePieChartAccessibility()`: For pie/donut charts with percentages

### Example Implementation
```tsx
const accessibilityData = useChartAccessibility(
  chartData,
  "Clicks over time showing total and unique clicks per day",
  "date",
  ["totalClicks", "uniqueClicks"]
);

<ChartWrapper height={300} accessibilityData={accessibilityData}>
  <ResponsiveContainer>
    <LineChart data={chartData}>
      {/* Visual chart */}
    </LineChart>
  </ResponsiveContainer>
</ChartWrapper>
```

### Updated Components
- ✅ `ClicksOverTime.tsx` - Now includes accessibility table
- 🔄 78 more chart components to update (queued)

## Phase 5: Freshness Signals ✅

### Implementation
- ✅ Dynamic "Last Updated: [Month] [Year]" in footer
- 🔄 Sitemap.xml `<lastmod>` updates (requires backend)
- 🔄 RSS feed with publication dates (requires backend)

## Rollout Plan

### Immediate (Week 1)
1. ✅ Deploy core infrastructure components
2. ✅ Update `ClicksOverTime.tsx` as reference implementation
3. 🔄 Update 10 highest-traffic pages to use `MainLayout`
4. 🔄 Add `LLMSchemaGenerator` to Index, Pricing, Features pages

### Short-term (Week 2-3)
1. 🔄 Update all 79 chart components with accessibility tables
2. 🔄 Wrap 50+ technical terms in `GlossaryTooltip`
3. 🔄 Create `/docs` public documentation route
4. 🔄 Add TL;DR blocks to blog post template

### Medium-term (Month 1)
1. 🔄 Scan `/blog/*` and `/features/*` for missing alt text
2. 🔄 Auto-generate H2 structure where missing
3. 🔄 Create automated freshness checker (CI/CD)
4. 🔄 Build sitemap generator with accurate `<lastmod>`

## Testing Checklist

### Manual Testing
- [ ] Verify single H1 on all pages
- [ ] Test keyboard navigation through semantic sections
- [ ] Validate JSON-LD schema with Google Rich Results Test
- [ ] Test screen reader with NVDA/JAWS on chart pages
- [ ] Verify glossary tooltips appear on hover

### Automated Testing
- [ ] Lighthouse accessibility score > 95
- [ ] Schema markup validation (schema.org validator)
- [ ] Screen reader compatibility tests
- [ ] Freshness timestamp updates monthly

## Known Limitations

1. **Sitemap Updates**: Requires backend edge function to generate dynamic lastmod dates
2. **Image Alt Text**: Manual audit required for 200+ marketing images
3. **Legacy Pages**: ~30 older blog posts need H2 structure retrofitting
4. **Chart Coverage**: 78 chart components queued for accessibility updates

## Next Steps (User Action Required)

### Content Team
1. Write 20-30 glossary definition pages (`/glossary/term-name`)
2. Add TL;DR blocks to existing blog posts
3. Create `/company` page with founding info, mission statement
4. Publish `/docs` public API documentation

### Engineering Team
1. Roll out `MainLayout` to all public pages
2. Update remaining 78 chart components with accessibility tables
3. Build automated alt text checker for images
4. Implement sitemap generator with dynamic lastmod

## Success Metrics

### Target KPIs
- **Schema Coverage**: 100% of public pages have JSON-LD markup
- **Accessibility Score**: Lighthouse 95+ on all pages
- **Glossary Terms**: 50+ terms with inline tooltips
- **Chart Accessibility**: 100% of visualizations have sr-only tables
- **Freshness**: Footer timestamp auto-updates monthly

### LLM Citation Tracking
- Monitor referrer traffic from ai.google.com, chat.openai.com, perplexity.ai
- Track "utm.one" mentions in LLM responses via brand monitoring tools
- Measure increase in /docs, /glossary page views from AI agents

---

**Last Updated**: December 2025  
**Implementation Status**: Phase 1-4 Complete | Phase 5 In Progress  
**Estimated Completion**: 3 weeks for full rollout