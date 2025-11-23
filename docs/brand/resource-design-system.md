# Resource Design System

This document defines the standardized design patterns for all resource pages within utm.one's knowledge system. All resource pages (guides, playbooks, templates, checklists, frameworks, examples, glossary) must adhere to these specifications to maintain visual consistency and brand integrity.

---

## Hero Section Specifications

**Spacing:**
- `py-20` (80px vertical padding) — consistent across all resource pages

**Typography:**
- **H1**: `text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground lowercase`
- **Description**: `text-lg md:text-xl text-muted-foreground max-w-[720px]`
- **Letter spacing**: Default (no custom letter-spacing needed)

**Gradient Effect:**
- Apply `.hero-gradient` class to major section titles for visual emphasis
- Background glow: Use `.hero-glow` wrapper for atmospheric depth

**Layout:**
- Max width: `max-w-[980px]` for category index pages
- Max width: `max-w-[1200px]` for detail pages with sidebar
- Centered alignment with `mx-auto px-8`

---

## Card Components

**Standard Card Treatment:**
```tsx
className="block group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
```

**Card Spacing:**
- Padding: `p-8` (32px)
- Border radius: `rounded-2xl` (16px)
- Gap between cards: `space-y-6`

**Hover States:**
- Border: `hover:border-primary/20`
- Shadow: `hover:shadow-lg`
- Transition: `transition-all duration-300`
- Title color: `group-hover:text-primary`

---

## Badge System

**Primary Badge (NEW items):**
```tsx
<Badge className="bg-primary text-primary-foreground animate-pulse">NEW</Badge>
```

**Secondary Badge:**
```tsx
<Badge variant="secondary">Label</Badge>
```

**Outline Badge:**
```tsx
<Badge variant="outline">Label</Badge>
```

**Usage Guidelines:**
- NEW badges should always include `animate-pulse` animation
- Use primary badges for time-sensitive highlights
- Use secondary/outline badges for supplementary metadata

---

## Typography Scale

**Headings:**
- H1: `text-4xl md:text-5xl lg:text-6xl` (36px → 48px → 60px)
- H2: `text-3xl md:text-4xl` (30px → 36px)
- H3: `text-2xl` (24px)
- H4: `text-xl` (20px)

**Body Text:**
- Large: `text-lg md:text-xl` (18px → 20px)
- Base: `text-base` (16px)
- Small: `text-sm` (14px)
- Extra small: `text-xs` (12px)

**Font Families:**
- Display/Headings: `font-display` (Space Grotesk)
- Body: Default sans (Inter)
- Metrics/Numbers: `font-display`

**Letter Spacing:**
- Headings: `-0.02em` (tighter for display font)
- Body: Default

---

## Color System

**Primary Palette:**
- Primary: `hsl(217 91% 60%)` — Electric Blue
- Foreground: `hsl(222 47% 11%)` — Dark blue-black
- Muted Foreground: `hsl(222 20% 35%)` — Blue-undertoned gray

**Semantic Tokens:**
- Background: `bg-background`
- Card: `bg-card`
- Muted: `bg-muted/20` (for section alternation)
- Border: `border-border/50`
- Primary hover: `hover:border-primary/20`

**Color Application:**
- Badges: `bg-primary text-primary-foreground`
- Hover states: `hover:text-primary`
- Icons: `text-primary` on colored backgrounds (`bg-primary/10`)

---

## Spacing System

**Section Spacing:**
- Standard section: `py-20` (80px vertical)
- Content max-width: `max-w-[980px]` or `max-w-[1200px]`
- Horizontal padding: `px-8`

**Component Spacing:**
- Between cards: `space-y-6` (24px)
- Between sections: `space-y-8` (32px)
- Between elements: `space-y-4` (16px)

**Responsive Spacing:**
- Mobile: Maintain `py-20` but reduce horizontal padding if needed
- Desktop: Full spacing with max-width constraints

---

## Layout Components

### ResourceLayout Component

**When to use:**
- All playbook detail pages
- All framework detail pages
- All template detail pages
- Complex resources with sidebar content

**When NOT to use:**
- Simple list/index pages (use standard layout)
- Guides (use GuideLayout for backward compatibility)

**Props:**
```typescript
{
  type: "guide" | "playbook" | "framework" | "checklist" | "template" | "example";
  title: string;
  subtitle: string;
  readTime?: string;
  lastUpdated?: string;
  badges?: Array<{ text: string; variant?: "default" | "secondary" | "outline" }>;
  breadcrumbs: Array<{ label: string; href: string }>;
  children: ReactNode;
  relatedResources?: Array<{ title: string; href: string; description: string }>;
  showProgress?: boolean;
}
```

### GuideLayout Component

**When to use:**
- All guide detail pages (for consistency with existing guides)

**Key differences from ResourceLayout:**
- Optimized for long-form prose content
- Includes reading progress bar
- Max-width prose styling

---

## Background Treatments

**Standard Pattern:**
- Alternate white (`bg-background`) and muted (`bg-muted/20`) sections
- Hero sections: `bg-background`
- Content sections: Alternate backgrounds for visual rhythm
- No decorative gradients on category index pages

**Detail Pages:**
- Hero: `bg-background` or `bg-gradient-to-br from-primary/5 to-primary/10` (for special emphasis)
- Content: Alternate `bg-background` and `bg-muted/20`

---

## Mobile Responsiveness

**Breakpoints:**
- Mobile: `< 768px`
- Tablet: `768px - 1024px` (md prefix)
- Desktop: `> 1024px` (lg prefix)

**Mobile-Specific Adjustments:**
- Typography scales down gracefully (use responsive classes)
- Cards become full-width on mobile
- Breadcrumbs remain visible and tappable (min 44px hit area)
- Share buttons show icons only on small screens (`hidden sm:inline`)

**Testing Checklist:**
- [ ] Hero titles scale properly
- [ ] Back navigation links are visible and tappable
- [ ] Cards are full-width on mobile
- [ ] Footer is fully functional
- [ ] Breadcrumbs don't break on small screens
- [ ] Search bars work on mobile (Glossary)

---

## Accessibility Standards

**WCAG AA Compliance:**
- Color contrast: Primary blue on white = 4.5:1+ ✓
- Interactive elements: All have focus states
- Semantic HTML: Proper heading hierarchy (h1 → h2 → h3)
- Link states: Visible hover, focus, and active states

**Screen Reader Support:**
- All icons have aria-labels where needed
- Heading hierarchy is semantic
- Interactive elements are keyboard accessible

**Focus States:**
- All interactive elements include default Tailwind focus rings
- Custom focus states for special components

---

## Navigation & Breadcrumbs

**Back Navigation:**
```tsx
<Link
  to="/resources"
  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
>
  <ArrowLeft className="w-4 h-4" />
  back to resources
</Link>
```

**Breadcrumbs:**
```tsx
<nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
  {breadcrumbs.map((crumb, index) => (
    <div key={crumb.href} className="flex items-center gap-2">
      {index > 0 && <span>/</span>}
      <Link to={crumb.href} className="hover:text-foreground transition-colors">
        {crumb.label}
      </Link>
    </div>
  ))}
</nav>
```

---

## Footer

**Standard Footer:**
- All resource pages use universal `<Footer />` component
- No inline footers
- Consistent with landing page footer

---

## Implementation Guidelines

### For Designers:
1. Start with these design tokens for all resource page mockups
2. Maintain Apple-minimalist aesthetic (generous white space, subtle shadows)
3. Use Space Grotesk for headings, Inter for body
4. Follow the electric blue + dark blue-black color story

### For Developers:
1. Always use ResourceLayout or GuideLayout for detail pages
2. Never create inline footers—use `<Footer />` component
3. Use semantic color tokens (e.g., `bg-primary` not `bg-blue-500`)
4. Maintain consistent spacing (`py-20`, `space-y-6`, etc.)
5. Test mobile responsiveness on all new pages

### For AI Tools:
1. Check this spec before generating resource page code
2. Use ResourceLayout component for new detail pages
3. Apply standardized hero sections (py-20, lowercase h1)
4. Maintain badge consistency (NEW = animate-pulse)
5. Follow breadcrumb pattern for navigation

---

## Quick Reference Checklist

**Before publishing any resource page:**

- [ ] Hero section uses `py-20`
- [ ] H1 includes `lowercase` class
- [ ] H1 uses responsive scale: `text-4xl md:text-5xl lg:text-6xl`
- [ ] Description uses: `text-lg md:text-xl text-muted-foreground max-w-[720px]`
- [ ] Cards use standardized hover states
- [ ] Badges use `bg-primary text-primary-foreground`
- [ ] NEW badges include `animate-pulse`
- [ ] Footer uses `<Footer />` component
- [ ] Back navigation link included
- [ ] Breadcrumbs are semantic and accessible
- [ ] Mobile responsiveness tested
- [ ] Color contrast meets WCAG AA
- [ ] Semantic HTML with proper heading hierarchy

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Maintained by:** utm.one Design System Team  
**Questions?** Refer to `docs/brand/design-system.md` for global design system specifications.
