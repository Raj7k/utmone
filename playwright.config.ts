import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for utm.one E2E smoke tests
 * Run with: npx playwright test
 */
export default defineConfig({
  testDir: "./e2e",
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 1,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"],
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for all tests
    baseURL: "http://localhost:8080",
    
    // Maximum time each action can take (e.g., click, fill)
    actionTimeout: 10000,
    
    // Maximum time for navigation
    navigationTimeout: 15000,
    
    // Collect trace when retrying failed test
    trace: "on-first-retry",
    
    // Take screenshot on failure
    screenshot: "only-on-failure",
    
    // Record video on failure
    video: "on-first-retry",
  },
  
  // Global timeout per test
  timeout: 30000,
  
  // Expect timeout
  expect: {
    timeout: 10000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    // Mobile viewport
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],

  // Run local dev server before starting tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
