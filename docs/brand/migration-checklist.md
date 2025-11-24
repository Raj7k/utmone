# Migration Checklist - Apple HIG Implementation

## Pre-Migration

### Phase 1: Foundation (Week 1-2)
- [x] Create brand documentation
- [x] Update `src/index.css` with Apple semantic colors
- [x] Update `tailwind.config.ts` with Apple tokens
- [ ] Test color system in all 4 appearance modes
- [ ] Run contrast checker on all new colors
- [ ] Verify color tokens work in browser DevTools

### Phase 2: Component Library (Week 3-4)
- [ ] Update Button component (add system variants)
- [ ] Update Input component (add system variant)
- [ ] Update Card component (add grouped variant)
- [ ] Create GroupedList component
- [ ] Create UTMBadge component
- [ ] Add enhanced focus indicators
- [ ] Add reduced motion support
- [ ] Create Storybook documentation
- [ ] Test all component variants

## Page Migration

### Product UI - Dashboard & Core (Week 5)
- [ ] `/dashboard` - Dashboard page
  - [ ] Replace color tokens with Apple semantic
  - [ ] Update buttons to `system` variants
  - [ ] Update card backgrounds to `grouped-background`
  - [ ] Test in all 4 appearance modes
  - [ ] Verify touch targets ≥ 44pt
  - [ ] Run accessibility audit

- [ ] `/links` - Links management
  - [ ] Table headers use `secondary-label`
  - [ ] Row backgrounds use `secondary-grouped-background`
  - [ ] Separators use `separator` color
  - [ ] Action buttons use `system` variant
  - [ ] Test sorting/filtering functionality
  - [ ] Test in all appearance modes

- [ ] `/analytics` - Analytics dashboard
  - [ ] Chart colors use Apple system palette
  - [ ] Metric cards use `grouped-list` pattern
  - [ ] Success states use `system-green`
  - [ ] Warning states use `system-orange`
  - [ ] Test data visualization clarity
  - [ ] Test in dark mode specifically

### Product UI - Settings (Week 6)
- [ ] `/settings` - Main settings
- [ ] `/settings/profile` - Profile settings
- [ ] `/settings/workspace` - Workspace settings
- [ ] `/settings/billing` - Billing settings
- [ ] `/settings/team` - Team settings
- [ ] `/settings/domains` - Custom domains
- [ ] `/settings/api` - API settings

**For each settings page:**
- [ ] Use `GroupedList` pattern for settings sections
- [ ] Toggle switches use `system-blue` when enabled
- [ ] Input fields use `system` variant (44pt height)
- [ ] Destructive actions use `system-destructive` variant
- [ ] Test keyboard navigation
- [ ] Test in all appearance modes

### Product UI - Link Detail (Week 6)
- [ ] `/links/:id` - Link detail page
  - [ ] UTM parameters use `UTMBadge` component
  - [ ] QR code section uses `grouped-background` card
  - [ ] Stats use Apple semantic colors
  - [ ] Edit mode uses `system` input variants
  - [ ] Actions use `system` button variants
  - [ ] Test edit functionality
  - [ ] Test in all appearance modes

### Product UI - Auth & Onboarding (Week 7)
- [ ] `/auth` - Authentication page
- [ ] `/login` - Login page
- [ ] `/signup` - Signup page
- [ ] `/onboarding` - Onboarding flow

**For each auth page:**
- [ ] Form inputs use `system` variant (44pt)
- [ ] Primary button uses `system` variant
- [ ] Error states use `system-red` with icon
- [ ] Clean Apple-style form layout
- [ ] Test form validation
- [ ] Test error states in all modes
- [ ] Verify focus indicators visible

### Marketing - Homepage (Week 8)
- [ ] `/` - Homepage
  - [ ] Hero keeps brand gradient
  - [ ] CTA buttons use `marketing` variant (blazeOrange)
  - [ ] Secondary buttons use `system-secondary`
  - [ ] Feature cards use `secondary-grouped-background`
  - [ ] Icons use `system-blue` or brand colors
  - [ ] Text uses Apple semantic (`label`, `secondary-label`)
  - [ ] Stats section keeps Space Grotesk + brand colors
  - [ ] Test all CTAs
  - [ ] Test in all appearance modes
  - [ ] Verify brand identity preserved

### Marketing - Features (Week 9)
- [ ] `/features/short-links` - Short Links
- [ ] `/features/utm-builder` - UTM Builder
- [ ] `/features/qr-generator` - QR Generator
- [ ] `/features/analytics` - Analytics
- [ ] `/features/enterprise-control` - Enterprise
- [ ] `/features/clean-track` - Clean Track
- [ ] `/features/partner-program` - Partners

**For each feature page:**
- [ ] Hero uses brand colors
- [ ] CTA uses `marketing` variant
- [ ] Feature cards use `grouped` variant
- [ ] UI elements use Apple semantic
- [ ] Test CTAs
- [ ] Test in all appearance modes
- [ ] Verify brand + Apple balance

### Marketing - Solutions (Week 10)
- [ ] `/solutions/marketers` - Marketers
- [ ] `/solutions/sales` - Sales Teams
- [ ] `/solutions/marketing-ops` - Marketing Ops

**For each solution page:**
- [ ] Same hybrid pattern as features
- [ ] Hero uses brand colors
- [ ] Cards use Apple semantic
- [ ] Test in all appearance modes

### Marketing - Pricing (Week 10)
- [ ] `/pricing` - Pricing page
  - [ ] Pricing cards use `grouped-background`
  - [ ] Feature lists use `GroupedList` pattern
  - [ ] Paid plan CTAs use `marketing` variant
  - [ ] Free tier CTA uses `system` variant
  - [ ] Checkmarks use `system-green`
  - [ ] Test plan comparison
  - [ ] Test in all appearance modes
  - [ ] Verify CTAs stand out

### Resources - Hub & Categories (Week 11)
- [ ] `/resources` - Resources hub
  - [ ] Category cards use `grouped-background`
  - [ ] Navigation uses Apple semantic
  - [ ] Search bar uses `system` input variant
  - [ ] Filter buttons use `system-secondary`
  - [ ] Test search functionality
  - [ ] Test filtering
  - [ ] Test in all appearance modes

- [ ] `/resources/reports` - Reports category
- [ ] `/resources/guides` - Guides category
- [ ] `/resources/docs` - Documentation category
- [ ] `/resources/case-studies` - Case Studies
- [ ] `/resources/webinars` - Webinars
- [ ] `/resources/templates` - Templates
- [ ] `/resources/infographics` - Infographics
- [ ] `/resources/checklists` - Checklists
- [ ] `/resources/videos` - Videos

**For each category page:**
- [ ] Header uses brand color (deepSea)
- [ ] Resource cards use `secondary-grouped-background`
- [ ] Tags use `UTMBadge` with system colors
- [ ] Pagination uses Apple system buttons
- [ ] Test navigation
- [ ] Test in all appearance modes

### Resources - Detail Pages (Week 12)
- [ ] Individual resource pages (template)
  - [ ] Hero uses brand gradient
  - [ ] Content area uses `system-background`
  - [ ] Sidebar uses `grouped-background`
  - [ ] Related resources use `GroupedList`
  - [ ] Share buttons use `system-blue`
  - [ ] Test content readability
  - [ ] Test in all appearance modes

## Accessibility Testing (Week 12-13)

### Automated Testing
- [ ] Run axe DevTools on all pages
- [ ] Fix all critical issues
- [ ] Fix all serious issues
- [ ] Document moderate issues

### Manual Testing
- [ ] VoiceOver navigation (macOS)
- [ ] VoiceOver navigation (iOS)
- [ ] Keyboard-only navigation
- [ ] Focus indicators visible in all modes
- [ ] Tab order logical on all pages
- [ ] All images have alt text
- [ ] All buttons have accessible names

### Contrast Testing
- [ ] Run contrast checker on all text
- [ ] Verify AA minimum (4.5:1 for text)
- [ ] Verify AA for UI (3:1)
- [ ] Fix any failures
- [ ] Re-test in High Contrast modes

### Touch Target Testing
- [ ] All buttons ≥ 44pt × 44pt
- [ ] All links ≥ 44pt × 44pt
- [ ] All form inputs ≥ 44pt tall
- [ ] All checkboxes/radios ≥ 44pt × 44pt
- [ ] Fix any violations

### Motion Testing
- [ ] Test with Reduced Motion enabled
- [ ] Verify animations respect preference
- [ ] Check for flashing/strobing
- [ ] Fix any violations

### Appearance Mode Testing
**For EVERY page:**
- [ ] Test in Light mode
- [ ] Test in Dark mode
- [ ] Test in Light + High Contrast
- [ ] Test in Dark + High Contrast
- [ ] Verify all colors adapt correctly
- [ ] Verify contrast maintained
- [ ] Fix any issues

## Browser Testing (Week 13)

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (macOS latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari (latest)
- [ ] Chrome Mobile (Android)
- [ ] Firefox Mobile (Android)

### Responsive Testing
- [ ] iPhone SE (375px)
- [ ] iPhone Pro (390px)
- [ ] iPad (768px)
- [ ] Desktop (1440px)
- [ ] Large Desktop (1920px+)

## Performance Testing (Week 13)

### Lighthouse Audits
- [ ] Run Lighthouse on all pages
- [ ] Aim for 95+ accessibility score
- [ ] Aim for 90+ performance score
- [ ] Fix Critical issues
- [ ] Fix High priority issues

### Specific Metrics
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5s

### CSS Performance
- [ ] Custom property recalculation tested
- [ ] Font loading optimized
- [ ] No layout thrashing

## Documentation (Week 13-14)

### Component Documentation
- [ ] Create Storybook stories for all variants
- [ ] Document Button variants
- [ ] Document Input variants
- [ ] Document Card variants
- [ ] Document GroupedList
- [ ] Document UTMBadge
- [ ] Document color tokens
- [ ] Add usage examples

### Developer Guidelines
- [ ] Component usage guide
- [ ] Color strategy guide
- [ ] Typography guide
- [ ] Accessibility guide
- [ ] Migration guide for new features
- [ ] Common mistakes to avoid

### Design Deliverables
- [ ] Figma design kit (optional)
- [ ] Color palette export
- [ ] Typography styles export
- [ ] Component library matching code

## Final QA (Week 14)

### Comprehensive Review
- [ ] All 50+ pages migrated
- [ ] All accessibility tests pass
- [ ] All browser tests pass
- [ ] All performance tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] All links work
- [ ] All forms work
- [ ] All interactions work

### Stakeholder Review
- [ ] Demo to stakeholders
- [ ] Gather feedback
- [ ] Address critical feedback
- [ ] Document future enhancements

### Deployment Preparation
- [ ] Create deployment checklist
- [ ] Test on staging environment
- [ ] Run final accessibility audit
- [ ] Run final performance audit
- [ ] Create rollback plan
- [ ] Document known issues

## Post-Launch (Week 15+)

### Monitoring
- [ ] Set up accessibility monitoring
- [ ] Set up performance monitoring
- [ ] Track user feedback
- [ ] Monitor error rates
- [ ] Monitor Lighthouse scores

### Iteration
- [ ] Review user feedback weekly
- [ ] Fix edge cases as discovered
- [ ] Update documentation as needed
- [ ] Add new component variants as needed

## Success Criteria

### Functional
- ✅ All colors adapt to Light/Dark/High Contrast
- ✅ All text meets WCAG AA minimum
- ✅ All touch targets ≥ 44pt
- ✅ Focus indicators visible in all modes
- ✅ Animations respect reduced motion
- ✅ Zero console errors

### Technical
- ✅ Lighthouse accessibility ≥ 95
- ✅ Lighthouse performance ≥ 90
- ✅ Color contrast validated
- ✅ All components documented
- ✅ 100% pages tested in 4 modes

### Design
- ✅ Apple HIG principles followed
- ✅ Brand identity preserved
- ✅ Professional experience
- ✅ Stakeholder approval

### User Experience
- ✅ Reduced accessibility complaints
- ✅ Positive feedback on dark mode
- ✅ Improved satisfaction scores
- ✅ Maintained/improved conversions
