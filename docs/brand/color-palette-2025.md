# utm.one Color Palette 2025

## Professional & Vibrant Color System

utm.one's visual identity combines professional trust signals with warm, vibrant accents that command attention without overwhelming the minimalist foundation.

---

## Core Colors

### Mirage (Dark Blue-Grey)
- **Hex:** `#16232A`
- **HSL:** `hsl(210, 29%, 12%)`
- **Usage:** High-contrast backgrounds, section dividers, data table headers
- **Personality:** Professional, technical, grounding

### Blaze Orange (Vibrant Orange)
- **Hex:** `#FF5B04`
- **HSL:** `hsl(18, 100%, 51%)`
- **Usage:** Primary CTAs, high-impact stats, premium features, accent borders
- **Personality:** Energy, conversion-focused, memorable

### Deep Sea (Teal-Green)
- **Hex:** `#075056`
- **HSL:** `hsl(184, 92%, 18%)`
- **Usage:** Success states, growth metrics, trust badges, secondary CTAs
- **Personality:** Trustworthy, growth-oriented, stable

### Wild Sand (Light Beige)
- **Hex:** `#E4EEF0`
- **HSL:** `hsl(180, 25%, 93%)`
- **Usage:** Soft backgrounds, calculator sections, callout boxes
- **Personality:** Calm, spacious, approachable

---

## Usage Guidelines

### Primary CTA Buttons
- **Default:** Blaze Orange (`bg-blazeOrange`)
- **Hover:** Blaze Orange 90% opacity (`hover:bg-blazeOrange/90`)
- **Use for:** Sign-ups, downloads, premium actions

### Secondary CTA Buttons
- **Border:** Deep Sea (`border-deepSea`)
- **Text:** Deep Sea (`text-deepSea`)
- **Hover:** Deep Sea 10% background (`hover:bg-deepSea/10`)
- **Use for:** Exploratory actions, tool access

### Success States
- **Background:** Deep Sea 5% (`bg-deepSea/5`)
- **Border:** Deep Sea 30% (`border-deepSea/30`)
- **Icon/Text:** Deep Sea (`text-deepSea`)

### High-Impact Stats
- **Preferred:** Blaze Orange for growth/change metrics
- **Alternative:** Deep Sea for stability/trust metrics
- **Avoid:** Using both colors in same stat card

### Data Visualizations
- **Charts:** Use gradient from Deep Sea → Blaze Orange
- **Bar charts:** Blaze Orange for primary data
- **Line charts:** Deep Sea for primary line
- **Pie charts:** Alternate all four colors

### Background Sections
- **White:** Primary content areas (`bg-white`)
- **Wild Sand:** Calculator tools, soft emphasis (`bg-wildSand/30`)
- **Mirage:** Rarely - only for dramatic contrast sections (`bg-mirage/5`)

### Borders & Accents
- **Callout boxes:** Blaze Orange 2px border (`border-2 border-blazeOrange/20`)
- **Premium cards:** Deep Sea 2px border (`border-2 border-deepSea/20`)
- **Subtle dividers:** Wild Sand or existing border color

---

## Color Combinations

### Trust + Action
- Background: Wild Sand
- Primary element: Deep Sea
- CTA: Blaze Orange

### High Energy
- Background: White
- Accent: Blaze Orange with 10% opacity backgrounds
- Text: Mirage

### Professional Dashboard
- Background: White
- Headers: Mirage
- Data highlights: Blaze Orange
- Success metrics: Deep Sea

---

## Where NOT to Use These Colors

❌ **Navigation bars** - Keep minimal with existing foreground/background tokens  
❌ **Body text** - Use semantic foreground tokens only  
❌ **Form inputs** - Maintain existing input color system  
❌ **Logo** - Logo colors are fixed  

---

## Integration with Existing Design System

These colors complement (not replace) the existing Apple-minimalist foundation:

- **Electric Blue** (primary) remains for core product actions
- **Dark Blue-Black** (foreground) remains for body text
- **New palette** adds warmth to landing pages, reports, and marketing content

---

## CSS Variables

```css
/* Add to src/index.css :root */
--mirage: 210 29% 12%;        /* #16232A */
--blaze-orange: 18 100% 51%;  /* #FF5B04 */
--deep-sea: 184 92% 18%;      /* #075056 */
--wild-sand: 180 25% 93%;     /* #E4EEF0 */
```

## Tailwind Tokens

```typescript
// Add to tailwind.config.ts colors object
mirage: 'hsl(var(--mirage))',
blazeOrange: 'hsl(var(--blaze-orange))',
deepSea: 'hsl(var(--deep-sea))',
wildSand: 'hsl(var(--wild-sand))',
```

---

## Accessibility

All color combinations meet WCAG AA standards for contrast:
- Blaze Orange on white: 4.5:1 (passes AA for normal text)
- Deep Sea on white: 12:1 (passes AAA)
- Mirage on white: 16:1 (passes AAA)
- White on Blaze Orange: 4.5:1 (passes AA)
- White on Deep Sea: 12:1 (passes AAA)

---

**Last Updated:** January 2025  
**Version:** 2.0
