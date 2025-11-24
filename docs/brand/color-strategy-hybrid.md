# Hybrid Color Strategy - Product vs Marketing

## Decision Tree

```
Is this page Product UI (requires login)?
  ├─ YES → Use Apple Semantic Colors
  │   ├─ Text: label, secondary-label, tertiary-label
  │   ├─ Backgrounds: system-background, grouped-background
  │   ├─ Actions: system-blue, system-green, system-red
  │   └─ UI Elements: fill-primary, separator
  │
  └─ NO → Is it Marketing/Public?
      ├─ YES → Use Hybrid Approach
      │   ├─ UI Chrome: Apple semantic colors
      │   ├─ CTAs: Brand colors (blazeOrange)
      │   ├─ Hero: Brand gradients
      │   └─ Content: Apple semantic + brand accents
      │
      └─ Resources → Use Hybrid Approach
          ├─ Navigation: Apple semantic
          ├─ Cards: Apple semantic
          └─ Content: Brand color accents
```

## Color Token Mapping

### Product UI Pages
| Use Case | Token | Value (Light) | Value (Dark) |
|----------|-------|---------------|--------------|
| Primary Text | `text-label` | #000000 | #FFFFFF |
| Secondary Text | `text-secondary-label` | #3C3C43 60% | #EBEBF5 60% |
| Primary Button | `bg-system-blue` | #3B82F6 | #409CFF |
| Success State | `text-system-green` | #28CD41 | #32D74B |
| Error State | `text-system-red` | #FF3B30 | #FF453A |
| Card Background | `bg-secondary-grouped-background` | #FFFFFF | #1C1C1E |
| Separator | `border-separator` | #3C3C43 29% | #545458 60% |

### Marketing Pages
| Use Case | Token | Notes |
|----------|-------|-------|
| Hero Background | `bg-gradient-hero` | Keep brand gradient |
| CTA Button | `bg-blazeOrange` | Primary brand CTA |
| Secondary Button | `system-secondary` variant | Apple UI element |
| Feature Card | `bg-secondary-grouped-background` | Apple semantic |
| Navigation | `text-label` | Apple semantic |
| Stats/Metrics | Space Grotesk font + brand colors | Keep brand |

### Resources Section
| Use Case | Token | Notes |
|----------|-------|-------|
| Category Header | Brand color (deepSea) | Brand accent |
| Resource Cards | `bg-secondary-grouped-background` | Apple semantic |
| Navigation | `text-label`, `system-blue` | Apple semantic |
| Tags | `UTMBadge` with system colors | Apple semantic |
| Content Area | `bg-system-background` | Apple semantic |

## Page-by-Page Breakdown

### Product UI (Full Apple Semantic)
- `/dashboard` - Dashboard
- `/links` - Links management
- `/analytics` - Analytics
- `/settings/*` - All settings pages
- `/links/:id` - Link detail
- `/auth` - Login/signup
- `/onboarding` - User onboarding

**Strategy:** Use Apple semantic colors exclusively. No brand colors except in logos.

### Marketing (Hybrid)
- `/` - Homepage
- `/features/*` - All 7 feature pages
- `/solutions/*` - All 3 solution pages
- `/pricing` - Pricing page
- `/about` - About page
- `/contact` - Contact page

**Strategy:** 
- Hero: Brand gradient background
- CTAs: Brand color (blazeOrange)
- UI Elements: Apple semantic (buttons, cards, navigation)
- Stats: Brand colors with Space Grotesk font

### Resources (Hybrid)
- `/resources` - Resources hub
- `/resources/:category` - Category pages
- `/resources/:category/:slug` - Individual resources

**Strategy:**
- Headers: Brand color accents (deepSea background)
- Cards: Apple semantic backgrounds
- Navigation: Apple semantic colors
- Tags: System colors for categorization
- Content: Apple semantic with occasional brand accents

## Examples

### Product UI Button
```tsx
// ✅ Correct - Product UI
<Button variant="system">Create Link</Button>
<Button variant="system-destructive">Delete</Button>

// ❌ Wrong - Don't use brand colors in product UI
<Button variant="marketing">Create Link</Button>
```

### Marketing Page Button
```tsx
// ✅ Correct - Marketing page
<Button variant="marketing">Get Started Free</Button>  // Blaze Orange
<Button variant="system-secondary">Learn More</Button>  // Apple subtle

// ❌ Wrong - Don't use pure system on hero CTAs
<Button variant="system">Get Started Free</Button>
```

### Text Hierarchy
```tsx
// ✅ Correct - Product UI
<h1 className="text-label text-title-1">Dashboard</h1>
<p className="text-secondary-label">Your recent activity</p>

// ✅ Correct - Marketing page (header)
<h1 className="hero-gradient text-hero">UTM.one</h1>  // Brand gradient
<p className="text-secondary-label">Build better links</p>  // Apple semantic
```

## Testing Checklist

For each page, verify:

### Product UI Pages
- [ ] No brand colors (mirage, blazeOrange, deepSea, wildSand) in UI
- [ ] All text uses `label`, `secondary-label`, `tertiary-label`
- [ ] All buttons use `system` variants
- [ ] All backgrounds use `system-background` or `grouped-background`
- [ ] Separators use `separator` token

### Marketing Pages
- [ ] Hero uses brand gradient or brand colors
- [ ] Primary CTAs use `marketing` variant (blazeOrange)
- [ ] Secondary buttons use `system-secondary` variant
- [ ] Feature cards use `secondary-grouped-background`
- [ ] Navigation uses Apple semantic colors
- [ ] Stats use Space Grotesk + brand colors

### Resources Pages
- [ ] Category headers use brand color accents
- [ ] Resource cards use Apple semantic backgrounds
- [ ] Navigation uses Apple semantic colors
- [ ] Tags use system colors
- [ ] Content area uses Apple semantic with brand accents

## Common Mistakes to Avoid

### ❌ Mixing Strategies on Same Page
```tsx
// Wrong - Mixing product and marketing on same page
<section className="bg-blazeOrange">  {/* Marketing */}
  <Button variant="system">Click Me</Button>  {/* Product UI */}
</section>
```

### ❌ Using Direct Colors
```tsx
// Wrong - Direct color values
<div className="bg-blue-500 text-white">

// Correct - Semantic tokens
<div className="bg-system-blue text-white">
```

### ❌ Ignoring Appearance Modes
```tsx
// Wrong - Only works in light mode
<div className="bg-white text-black">

// Correct - Adapts to all modes
<div className="bg-system-background text-label">
```

## Quick Reference

### When to use Brand Colors:
- Marketing page heroes
- Marketing CTAs
- Marketing stats/metrics
- Resource category headers
- Logo and brand elements

### When to use Apple Semantic Colors:
- All product UI pages
- Marketing page UI elements (cards, buttons, navigation)
- All text hierarchy
- All backgrounds (except marketing heroes)
- All separators and borders
- All interactive states

## Validation

Before deploying a page:
1. Screenshot in Light mode
2. Screenshot in Dark mode
3. Screenshot in Light + High Contrast
4. Screenshot in Dark + High Contrast
5. Verify color strategy matches page type
6. Run contrast checker on all text
7. Verify touch targets are 44pt minimum
