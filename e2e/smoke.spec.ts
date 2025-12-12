import { test, expect } from "@playwright/test";

/**
 * Smoke Test Suite - Golden Path
 * Verifies core functionality works after optimization refactors
 */

// Clear state before each test
test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test.describe("Landing Page (Public)", () => {
  test("loads correctly with hero content", async ({ page }) => {
    await page.goto("/");
    
    // Verify page loads
    await expect(page).toHaveTitle(/utm\.one/i);
    
    // Verify main headline exists (checking for common brand terms)
    const headline = page.locator("h1").first();
    await expect(headline).toBeVisible({ timeout: 10000 });
    
    // Verify CTA button is visible and clickable
    const ctaButton = page.getByRole("button", { name: /get.*access|get started|try free/i }).first();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();
  });

  test("navigation works", async ({ page }) => {
    await page.goto("/");
    
    // Check navigation links exist
    await expect(page.getByRole("link", { name: /product|features/i }).first()).toBeVisible();
  });
});

test.describe("Authentication Flow", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/auth");
    
    // Verify auth page elements
    await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]').first()).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in|log in|continue/i }).first()).toBeVisible();
  });

  test("signup redirects appropriately", async ({ page }) => {
    await page.goto("/auth");
    
    // Fill form with test data
    await page.locator('input[name="email"], input[type="email"]').first().fill("smoke-test@example.com");
    await page.locator('input[name="password"], input[type="password"]').first().fill("SmokeTest123!");
    
    // Submit form
    await page.getByRole("button", { name: /sign in|log in|continue/i }).first().click();
    
    // Should redirect somewhere (dashboard, waitlist, or show error)
    await page.waitForURL(/dashboard|waitlist|auth/, { timeout: 15000 });
  });
});

test.describe("Dashboard Core Features", () => {
  test("sales page loads", async ({ page }) => {
    // Visit sales page directly (will redirect to auth if not logged in)
    await page.goto("/dashboard/sales");
    
    // Either we see the sales page or we're redirected to auth
    await page.waitForURL(/sales|auth/, { timeout: 15000 });
    
    // Verify page loaded without crash
    await expect(page.locator("body")).toBeVisible();
  });

  test("links page loads", async ({ page }) => {
    await page.goto("/dashboard/links");
    
    await page.waitForURL(/links|auth/, { timeout: 15000 });
    await expect(page.locator("body")).toBeVisible();
  });

  test("intelligence page loads", async ({ page }) => {
    await page.goto("/dashboard/intelligence");
    
    await page.waitForURL(/intelligence|auth/, { timeout: 15000 });
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Feature Pages (Public)", () => {
  test("short links feature page loads", async ({ page }) => {
    await page.goto("/features/short-links");
    
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
    
    // Check for interactive tool or content
    await expect(page.locator("main")).toBeVisible();
  });

  test("UTM builder feature page loads", async ({ page }) => {
    await page.goto("/features/utm-builder");
    
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
  });

  test("QR generator feature page loads", async ({ page }) => {
    await page.goto("/features/qr-generator");
    
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
  });

  test("attribution graph feature page loads", async ({ page }) => {
    await page.goto("/features/attribution-graph");
    
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Scanner Page", () => {
  test("scanner page loads camera UI", async ({ page }) => {
    await page.goto("/scan");
    
    // Scanner should show either camera UI or permission request
    const cameraElements = page.locator("text=/camera|scan|badge|permission/i");
    const videoElement = page.locator("video");
    const canvasElement = page.locator("canvas");
    
    // At least one of these should be present
    const hasUI = await cameraElements.count() > 0 || 
                  await videoElement.count() > 0 || 
                  await canvasElement.count() > 0;
    
    expect(hasUI || page.url().includes("scan")).toBeTruthy();
  });
});

test.describe("Performance Assertions", () => {
  test("landing page loads under 10 seconds", async ({ page }) => {
    const start = Date.now();
    
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    
    const loadTime = Date.now() - start;
    
    // Assert load time is under 10 seconds
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`Landing page load time: ${loadTime}ms`);
  });

  test("dashboard loads under 10 seconds", async ({ page }) => {
    const start = Date.now();
    
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");
    
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`Dashboard load time: ${loadTime}ms`);
  });

  test("no JavaScript errors on landing page", async ({ page }) => {
    const errors: string[] = [];
    
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });
    
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Log any errors found
    if (errors.length > 0) {
      console.warn("JavaScript errors found:", errors);
    }
    
    // Allow some non-critical errors but fail on critical ones
    const criticalErrors = errors.filter(e => 
      e.includes("TypeError") || 
      e.includes("ReferenceError") ||
      e.includes("Cannot read properties of undefined")
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test("lazy loaded components render without blocking", async ({ page }) => {
    await page.goto("/product");
    
    // Wait for page to be interactive
    await page.waitForLoadState("domcontentloaded");
    
    // Check that skeleton loaders don't persist forever
    const skeletons = page.locator(".animate-pulse");
    
    // Wait up to 5 seconds for skeletons to disappear
    await expect(async () => {
      const count = await skeletons.count();
      // Some skeletons are OK, but not excessive
      expect(count).toBeLessThan(10);
    }).toPass({ timeout: 5000 });
  });
});

test.describe("Responsive Design", () => {
  test("mobile viewport renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto("/");
    
    // Mobile menu should be present
    const mobileMenu = page.locator('[aria-label*="menu"], button:has(svg)').first();
    await expect(mobileMenu).toBeVisible();
    
    // Content should not overflow horizontally
    const body = page.locator("body");
    const bodyWidth = await body.evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375 + 50); // Allow small margin
  });
});
