# Apple HIG Design System Guidelines for UTM.one

## Overview
This document outlines the Apple Human Interface Guidelines (HIG) implementation for UTM.one, creating a professional, accessible, and cohesive user experience.

## Strategic Approach

### Hybrid Color Strategy

**Product UI (Dashboard, Settings, Analytics):**
- Use Apple semantic color system
- Full Light/Dark/High Contrast support
- System colors for actions and states

**Marketing Pages (Homepage, Features, Pricing):**
- Keep existing brand colors as accents
- Use Apple UI elements for chrome/navigation
- Brand colors for CTAs and hero sections

**Resources Section:**
- Hybrid: Apple system for UI, brand colors for content

## Apple Semantic Color System

### Label Colors (Text Hierarchy)
- `--label`: Primary text (black in light, white in dark)
- `--secondary-label`: Secondary information (60% opacity)
- `--tertiary-label`: Tertiary information (30% opacity)
- `--quaternary-label`: Placeholder text (18% opacity)

### Fill Colors (UI Elements)
- `--fill-primary`: Primary fill (20% opacity)
- `--fill-secondary`: Secondary fill (16% opacity)
- `--fill-tertiary`: Tertiary fill (12% opacity)

### System Colors
- `--system-blue`: Primary actions, links, focus states
- `--system-green`: Success states, positive actions
- `--system-red`: Destructive actions, errors
- `--system-orange`: Warnings
- `--system-yellow`: Caution states
- `--system-teal`: Information
- `--system-indigo`: Secondary accents

### System Grays (6 levels)
- `--system-gray` through `--system-gray-6`
- Used for backgrounds, separators, and neutral UI

### Background Colors
- `--system-background`: Primary background
- `--secondary-system-background`: Secondary backgrounds
- `--tertiary-system-background`: Tertiary backgrounds

### Grouped Backgrounds (for cards/lists)
- `--grouped-background`: Base grouped background
- `--secondary-grouped-background`: Individual items
- `--tertiary-grouped-background`: Nested items

### Separators
- `--separator`: Standard separator with transparency
- `--opaque-separator`: Opaque separator for solid dividers

## UTM Parameter Color Coding

Each UTM parameter has its own system color for easy identification:
- `utm_source`: System Blue
- `utm_medium`: System Indigo
- `utm_campaign`: System Teal
- `utm_term`: System Green
- `utm_content`: System Yellow

## Apple Dynamic Type Scale

Following iOS text styles for consistency:
- **Large Title**: 34px/41px - Major headlines
- **Title 1**: 28px/34px - Section headers
- **Title 2**: 22px/28px - Subsection headers
- **Title 3**: 20px/25px - Group headers
- **Headline**: 17px/22px (600 weight) - Emphasized body
- **Body**: 17px/22px - Standard body text
- **Callout**: 16px/21px - Secondary body
- **Subheadline**: 15px/20px - Captions
- **Footnote**: 13px/18px - Fine print
- **Caption 1**: 12px/16px - Image captions
- **Caption 2**: 11px/14px - Smallest text

## Accessibility Requirements

### WCAG Compliance
- **AA Level Minimum**: 4.5:1 contrast for text, 3:1 for UI components
- **AAA Target**: 7:1 contrast for body text where possible

### Touch Targets
- Minimum 44x44pt for all interactive elements
- No exceptions for critical actions

### Focus Indicators
- 2pt solid outline in primary color
- 2pt offset from element
- Visible in all appearance modes
- 3pt width in High Contrast mode

### Motion
- Respect `prefers-reduced-motion`
- Smooth transitions (200ms cubic-bezier)
- No animations if motion is disabled

### Appearance Modes
All UI must support:
1. Light mode
2. Dark mode
3. Light + High Contrast
4. Dark + High Contrast

## Component Variants

### Buttons
- `system`: Primary actions (product UI)
- `system-secondary`: Secondary actions with subtle fill
- `system-tertiary`: Tertiary actions (text only)
- `system-destructive`: Destructive actions
- `marketing`: Marketing CTAs (brand colors)

### Inputs
- `system`: Product UI inputs (44pt height, semantic colors)
- `default`: Legacy (phase out gradually)

### Cards
- `grouped`: Apple-style grouped cards with subtle borders
- `default`: Legacy cards

## Implementation Rules

### Do:
- ✅ Use semantic color tokens (`label`, `system-blue`, etc.)
- ✅ Maintain 44pt minimum touch targets
- ✅ Test in all 4 appearance modes
- ✅ Use Apple Dynamic Type scale
- ✅ Respect motion preferences
- ✅ Apply focus indicators consistently

### Don't:
- ❌ Use direct color values (e.g., `text-black`, `bg-white`)
- ❌ Skip accessibility testing
- ❌ Ignore High Contrast mode
- ❌ Create touch targets smaller than 44pt
- ❌ Mix product and marketing color strategies on same page

## Migration Checklist

When adding a new feature:
1. [ ] Determine page type (Product UI vs Marketing)
2. [ ] Choose appropriate color strategy
3. [ ] Use semantic tokens exclusively
4. [ ] Verify 44pt minimum touch targets
5. [ ] Test all 4 appearance modes
6. [ ] Run contrast checker (WCAG AA minimum)
7. [ ] Test keyboard navigation
8. [ ] Test with VoiceOver/screen reader
9. [ ] Verify reduced motion support
10. [ ] Document component variants used

## Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Maintenance

This design system should be reviewed and updated:
- Quarterly for new Apple HIG updates
- When adding new component variants
- After user feedback on accessibility
- When WCAG standards are updated
