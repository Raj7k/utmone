# 🍎 UTM.ONE — FIGMA DESIGN SYSTEM

(Apple-level Design Language)

---

## 🎨 1. Design Tokens

### Colors

#### Neutral Base

* `--bg-primary: #FAFAF9`
* `--bg-secondary: #FFFFFF`
* `--border: rgba(0,0,0,0.08)`
* `--shadow: rgba(0,0,0,0.04)`

#### Text

* `--text-primary: #18181B`
* `--text-secondary: #71717A`
* `--text-tertiary: #A1A1AA`

#### Accent

* `--indigo: #6366F1`
* `--indigo-light: #818CF8`
* `--indigo-dark: #4F46E5`

#### Utility

* `--success: #10B981`
* `--error: #EF4444`
* `--warning: #F59E0B`

---

## 🔠 2. Typography Tokens

**Heading 1**
* Inter Bold 72px / 1.05 line-height

**Heading 2**
* Inter Bold 40px / 1.15 lh

**Heading 3**
* Inter Semibold 28px / 1.2 lh

**Body**
* Inter Regular 18px / 1.6 lh

**Small**
* Inter Medium 14px / 1.4 lh

**Micro**
* Inter Regular 12px / 1.4 lh

---

## 📐 3. Spacing System

Use Apple's visual rhythm:

* `space-128` — Section padding
* `space-96` — Between large groups
* `space-64` — Between cards
* `space-32` — Between content blocks
* `space-16` — Inner padding
* `space-8` — Tight elements

---

## 🧱 4. Components

### Buttons

#### Primary Button

* Fill: `--indigo`
* Radius: 12px
* Text: white
* Height: 48px
* Hover: darker indigo, soft shadow

#### Secondary Button

* Border: `--border`
* Text: `--text-primary`
* Background: white

---

### Cards

* Background: white
* Padding: 32px
* Radius: 16px
* Shadow: `0 4px 24px rgba(0,0,0,0.04)`
* Border: `--border`

---

### Inputs

* Height: 44px
* Border: `--border`
* Focus: `--indigo-light` ring
* Radius: 12px

---

### Tables

* Row height: 56px
* Border between rows: 1px `--border`
* Header: Inter Medium 14px

---

### Navigation

#### Top Nav

* Height: 72px
* Center-aligned menu
* Logo left, CTAs right
* Minimal icons

---

## 📊 5. Charts

### Line Chart

* Soft gradient
* One color only
* Minimal axes
* Large whitespace
* Clean tooltip

### Pie Chart (Device / Region)

* Soft edges
* 60-degree slices max
* No heavy labels

---

## 🧭 6. Layout Templates

### Landing Page Layout

* Hero: Center aligned, 128px padding
* Feature rows: 2-column alternating
* Screenshots: floating card style
* CTA: full-width block

---

### Dashboard Layout

* Left nav: minimal, icons only
* Content: center-aligned grid
* Card-based analytics
* Big whitespace

---

### Onboarding Wizard

* Full-screen centered card
* Progress indicator dots
* Large, readable text
* One action per screen

---

## 🎞 7. Motion Principles

* 180–240ms ease-out
* Subtle scale on hover
* Fade transitions
* Smooth slide for onboarding
* No bounce, no overshoot

---

## 📋 Usage Guidelines

### For Designers

Use this system as the foundation for all utm.one UI/UX work:
1. Start with tokens (colors, spacing, typography)
2. Build components following specifications
3. Compose layouts using templates
4. Apply motion principles sparingly

### For Developers

Implement this system in code:
1. Define CSS variables matching design tokens
2. Create component library (React/shadcn/ui)
3. Use Tailwind classes mapped to tokens
4. Ensure all animations follow motion principles

### For AI Tools

When building utm.one features:
1. Reference these tokens for all styling decisions
2. Follow component specifications exactly
3. Maintain spacing system throughout
4. Apply motion principles to interactions
