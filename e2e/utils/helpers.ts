import { Page, expect } from "@playwright/test";

/**
 * Helper utilities for E2E tests
 */

/**
 * Wait for page to be fully loaded (no pending network requests)
 */
export async function waitForPageReady(page: Page, timeout = 10000) {
  await page.waitForLoadState("networkidle", { timeout });
}

/**
 * Login with test credentials
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto("/auth");
  
  await page.locator('input[name="email"], input[type="email"]').first().fill(email);
  await page.locator('input[name="password"], input[type="password"]').first().fill(password);
  
  await page.getByRole("button", { name: /sign in|log in|continue/i }).first().click();
  
  // Wait for redirect
  await page.waitForURL(/dashboard|waitlist/, { timeout: 15000 });
}

/**
 * Clear all browser storage
 */
export async function clearStorage(page: Page) {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Take a performance snapshot
 */
export async function measurePerformance(page: Page) {
  const metrics = await page.evaluate(() => {
    const timing = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.startTime,
      loadComplete: timing.loadEventEnd - timing.startTime,
      firstPaint: performance.getEntriesByName("first-paint")[0]?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0,
    };
  });
  
  return metrics;
}

/**
 * Check for console errors
 */
export function setupConsoleErrorCapture(page: Page) {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
    if (msg.type() === "warning") {
      warnings.push(msg.text());
    }
  });
  
  return { errors, warnings };
}

/**
 * Assert element is visible within timeout
 */
export async function assertVisible(page: Page, selector: string, timeout = 10000) {
  await expect(page.locator(selector)).toBeVisible({ timeout });
}

/**
 * Assert no critical JavaScript errors
 */
export function assertNoCriticalErrors(errors: string[]) {
  const criticalPatterns = [
    "TypeError",
    "ReferenceError",
    "SyntaxError",
    "Cannot read properties of undefined",
    "Cannot read properties of null",
    "is not a function",
    "is not defined",
  ];
  
  const criticalErrors = errors.filter(error =>
    criticalPatterns.some(pattern => error.includes(pattern))
  );
  
  expect(criticalErrors).toEqual([]);
}
