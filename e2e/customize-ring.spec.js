/**
 * E2E test: Complete ring customizer journey
 *
 * Prerequisites — this test hits the REAL backend and database:
 *   1. docker compose up -d
 *   2. cd backend && npm run db:migrate:dev && node drizzle/seed.js
 *   3. npm run server    (backend on port 4001)
 *   4. npm run test:e2e  (Playwright starts Vite automatically)
 *
 * What's different from a unit test:
 *   - A real Chromium browser loads the actual React app
 *   - Clicks, navigation, and network requests happen exactly as a user would do them
 *   - If the backend isn't running, the test fails with a clear message (see beforeAll)
 */

import { test, expect } from '@playwright/test'

const BACKEND_URL = 'http://localhost:4001'

// ── Guard: fail early with a helpful message if prerequisites aren't met ───────
test.beforeAll(async ({ request }) => {
  // Try to reach the diamond endpoint. If the backend is down this throws
  // (ECONNREFUSED), and we surface a clear "start your server" message instead
  // of a confusing timeout deep inside the test.
  let diamonds
  try {
    const res = await request.get(`${BACKEND_URL}/api/getAllFilteredDiamonds`)
    if (!res.ok()) {
      throw new Error(`Backend returned HTTP ${res.status()}. Is the database running?`)
    }
    diamonds = await res.json()
  } catch (err) {
    throw new Error(
      `\nBackend not reachable at ${BACKEND_URL}.\n` +
      `Start it with:\n  docker compose up -d\n  npm run server\n\n` +
      `Original error: ${err.message}`
    )
  }

  if (!Array.isArray(diamonds) || diamonds.length === 0) {
    throw new Error(
      `No diamonds found in the database.\n` +
      `Seed the DB first:\n  cd backend && node drizzle/seed.js`
    )
  }
})

// ── The main journey ──────────────────────────────────────────────────────────
test.describe('Ring Customizer', () => {
  test('guest user builds a custom ring and adds it to cart', async ({ page }) => {

    // ── Step 1: Choose a diamond ──────────────────────────────────────────────
    await page.goto('/customize')

    // The diamond grid heading confirms Step 1 has loaded
    await expect(page.getByText('Select your center stone')).toBeVisible()

    // Diamond cards are <button> elements inside <main> (the Filters panel sits
    // outside <main> in DiamondGrid.jsx, so this selector only matches cards)
    const firstDiamond = page.locator('main button').first()
    await expect(firstDiamond).toBeVisible()
    await firstDiamond.click()

    // Clicking a card swaps to the Diamond detail view (showDiamond → true)
    const selectDiamondBtn = page.getByRole('button', { name: 'Select this diamond' })
    await expect(selectDiamondBtn).toBeVisible()
    await selectDiamondBtn.click()

    // ── Step 2: Choose a ring setting ─────────────────────────────────────────
    // Clicking "Select this diamond" dispatches setStep(2), which renders RingGrid.
    // RingGrid fires getAllStyles — wait for the heading to confirm it loaded.
    await expect(page.getByText('Choose your setting')).toBeVisible()

    // Ring cards are also <button> elements inside <main> in RingGrid.jsx
    const firstRing = page.locator('main button').first()
    await expect(firstRing).toBeVisible()
    await firstRing.click()

    // Ring detail view
    const selectSettingBtn = page.getByRole('button', { name: 'Select this setting' })
    await expect(selectSettingBtn).toBeVisible()
    await selectSettingBtn.click()

    // ── Step 3: Review and add to cart ────────────────────────────────────────
    // "Select this setting" dispatches setStep(3) because a diamond was already
    // chosen, which renders StepThree.
    const addToCartBtn = page.getByRole('button', { name: 'Add to cart' })
    await expect(addToCartBtn).toBeVisible()

    // Pick ring size 6 (default is 4 — changing it confirms the selector works)
    await page.getByRole('button', { name: '6', exact: true }).click()

    await addToCartBtn.click()

    // addToCart thunk: POST /api/users/addToCart → refetch cart → resetCustomization → navigate('/cart')
    await page.waitForURL('**/cart', { timeout: 15_000 })
    await expect(page).toHaveURL(/\/cart/)
  })
})
