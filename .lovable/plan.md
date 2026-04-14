

## Plan: Fix Sign In Links Pointing to Wrong Routes

### Problem
Multiple "Sign In" links across the marketing site point to `/sign-in`, which is not a defined route. The correct auth route is `/auth`. This causes a 404 on the published site (`utm.one/auth` works, but `/sign-in` does not exist).

### Files to Fix

**1. `src/components/landing/Navigation.tsx`** (line 407)
- Change `<Link to="/sign-in">` → `<Link to="/auth">`

**2. `src/components/landing/ResourcesNavigation.tsx`** (lines 130, 197)
- Change both `<Link to="/sign-in">` → `<Link to="/auth">`

### What stays the same
- `FloatingNavigation.tsx` already uses `/auth` correctly
- `FloatingActionButton.tsx` already uses `/auth` correctly

### After fix
All "Sign In" buttons across desktop and mobile navigation will correctly route to the `/auth` page.

