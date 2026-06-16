import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',

  // Each test gets 60 s — the add-to-cart thunk involves two API calls
  timeout: 60 * 1000,

  // No retries for now; a flaky E2E test is a bug to fix, not to retry away
  retries: 0,

  // The customizer uses shared Redux state — run tests one at a time
  fullyParallel: false,
  workers: 1,

  reporter: 'list',

  use: {
    baseURL: 'http://localhost:3006',

    // Save a Playwright trace on failure so you can replay exactly what happened.
    // View with: npx playwright show-trace test-results/<name>/trace.zip
    trace: 'on-first-retry',

    // Save a video of failing tests
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Start the Vite dev server automatically.
  // The backend (port 4001) must already be running — see e2e/customize-ring.spec.js
  // for a clear error message if it isn't.
  webServer: {
    command: 'npm run start:dev',
    url: 'http://localhost:3006',
    reuseExistingServer: true, // don't restart if already running
    timeout: 30 * 1000,
  },
})
