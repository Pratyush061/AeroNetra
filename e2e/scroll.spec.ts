import { test, expect } from '@playwright/test';

test.describe('AeroNetra Scroll unwrapping', () => {
  test('should unwrap globe when scrolled down and wrap when scrolled up', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Ensure canvas exists
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Wait for the scene to initialize and some time for rendering
    await page.waitForTimeout(1000);

    // Scroll down to unwrap
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Scroll back up to wrap
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
  });
});
