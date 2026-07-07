import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@example.com';
const PASSWORD = 'adminpassword123';
const PRODUCT_NAME = 'E2E Admin Test Product';

test.describe('Admin Flow', () => {
  test('Admin Login, Create Product, Edit Product, Manage Orders', async ({ page }) => {
    test.setTimeout(60000); // 60 seconds

    // 1. Admin Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 10000 });
    
    // We should be redirected to the homepage, now navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Overview');

    // 2. Go to Products
    await page.goto('http://localhost:3000/dashboard/products');
    await page.waitForLoadState('networkidle');

    // 3. Create a Product
    await page.goto('http://localhost:3000/dashboard/products/new');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="name"]', PRODUCT_NAME);
    await page.fill('textarea[name="description"]', 'A delicious test product');
    await page.fill('input[name="price"]', '99.99');
    await page.fill('input[name="stock"]', '100');
    await page.selectOption('select[name="category"]', 'Snacks');
    await page.fill('input[name="imageUrl"]', 'https://images.unsplash.com/photo-1550411294-5f5f7e6e3b9e');
    await page.click('button:has-text("Create Product")');

    // Wait for redirect to products page
    await page.waitForURL('http://localhost:3000/dashboard/products', { timeout: 10000 });
    await expect(page.locator(`text=${PRODUCT_NAME}`).first()).toBeVisible();

    // 4. Edit Product
    // Find the edit button for this product
    await page.locator(`tr:has-text("${PRODUCT_NAME}") >> a[href*="/edit"]`).click();
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="price"]', '149.99');
    await page.click('button:has-text("Update Product")');
    await page.waitForURL('http://localhost:3000/dashboard/products', { timeout: 10000 });
    await expect(page.locator(`tr:has-text("${PRODUCT_NAME}")`)).toContainText('₹149.99');

    // 6. Manage Orders
    await page.goto('http://localhost:3000/dashboard/orders');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Orders');
    
    // Check if order table loads properly
    await expect(page.locator('table')).toBeVisible();

  });
});
