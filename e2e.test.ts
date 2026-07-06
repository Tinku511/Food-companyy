import { test, expect } from '@playwright/test';

/**
 * Full Customer Journey E2E Test
 *
 * Each test that requires authentication creates its OWN unique user
 * so tests are fully independent and don't conflict with each other
 * when run sequentially (same email = 409 conflict on signup).
 */

// Unique email factory — call once per test that needs an account
function uniqueEmail() {
  return `e2e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@example.com`;
}

const PASSWORD = 'password123';
const USER_NAME = 'E2E Test Customer';

/** Signup a new user and return on the /login page ready to sign in */
async function signup(page: any, email: string) {
  await page.goto('http://localhost:3000/signup');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 15_000 });
  await page.fill('input[name="name"]', USER_NAME);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/login**', { timeout: 15_000 });
}

/** Login and wait until we leave /login */
async function login(page: any, email: string) {
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  // next-auth uses router.push(callbackUrl) + router.refresh() — can be slow
  await page.waitForURL('http://localhost:3000/**', { timeout: 30_000 });
  await page.waitForLoadState('networkidle');
  // Confirm we are NOT still on /login
  expect(page.url()).not.toMatch(/\/login/);
}

// ─── 1. Sign Up ──────────────────────────────────────────────────────────────
test('1. Sign up creates a new account and redirects to login', async ({ page }) => {
  const email = uniqueEmail();
  await page.goto('http://localhost:3000/signup');
  await page.waitForLoadState('networkidle');

  await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 15_000 });

  await page.fill('input[name="name"]', USER_NAME);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');

  await page.waitForURL('**/login**', { timeout: 15_000 });
  await expect(page).toHaveURL(/\/login/);
});

// ─── 2. Login ────────────────────────────────────────────────────────────────
test('2. Login with new credentials redirects to home', async ({ page }) => {
  const email = uniqueEmail();
  await signup(page, email);
  await login(page, email);
  // Should now be on home or callbackUrl — not on /login
  expect(page.url()).not.toMatch(/\/login/);
});

// ─── 3. Browse Products ──────────────────────────────────────────────────────
test('3. Browse products page and open a product', async ({ page }) => {
  await page.goto('http://localhost:3000/products');
  await page.waitForLoadState('networkidle');

  const productCard = page.locator('a[id^="product-card-"]').first();
  await expect(productCard).toBeVisible({ timeout: 15_000 });
  await productCard.click();
  await page.waitForLoadState('networkidle');

  await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible({ timeout: 10_000 });
});

// ─── 4. Add to Cart ──────────────────────────────────────────────────────────
test('4. Add product to cart (requires login)', async ({ page }) => {
  const email = uniqueEmail();
  await signup(page, email);
  await login(page, email);

  await page.goto('http://localhost:3000/products');
  await page.waitForLoadState('networkidle');
  await page.locator('a[id^="product-card-"]').first().click();
  await page.waitForLoadState('networkidle');
  await page.click('button:has-text("Add to Cart")');
  await page.waitForTimeout(1000);

  await page.goto('http://localhost:3000/cart');
  await page.waitForLoadState('networkidle');
  // Empty cart message should NOT be visible
  const emptyMsg = page
    .locator('text=Your cart is empty')
    .or(page.locator('text=Nothing to checkout'));
  const isEmpty = await emptyMsg.isVisible().catch(() => false);
  expect(isEmpty).toBeFalsy();
});

// ─── 5. Checkout Form ────────────────────────────────────────────────────────
test('5. Checkout form accepts shipping details', async ({ page }) => {
  const email = uniqueEmail();
  await signup(page, email);
  await login(page, email);

  // Add a product
  await page.goto('http://localhost:3000/products');
  await page.waitForLoadState('networkidle');
  await page.locator('a[id^="product-card-"]').first().click();
  await page.waitForLoadState('networkidle');
  await page.click('button:has-text("Add to Cart")');
  await page.waitForTimeout(1000);

  // Go to checkout
  await page.goto('http://localhost:3000/checkout');
  await page.waitForLoadState('networkidle');

  // Fill all shipping fields
  await page.fill('input[name="fullName"]', USER_NAME);
  await page.fill('input[name="address"]', '123 Test Street, Apt 4B');
  await page.fill('input[name="city"]', 'Mumbai');
  await page.fill('input[name="state"]', 'Maharashtra');
  await page.fill('input[name="pincode"]', '400001');
  await page.fill('input[name="phone"]', '9876543210');

  await expect(page.locator('input[name="fullName"]')).toHaveValue(USER_NAME);
  await expect(page.locator('input[name="city"]')).toHaveValue('Mumbai');
  await expect(page.locator('input[name="pincode"]')).toHaveValue('400001');
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

// ─── 6. Order Tracking ───────────────────────────────────────────────────────
test('6. Order tracking page loads and shows search input', async ({ page }) => {
  await page.goto('http://localhost:3000/track');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('h1:has-text("Track Your Order")')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('input[placeholder*="e.g."]')).toBeVisible();
});
