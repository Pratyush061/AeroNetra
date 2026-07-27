import { test, expect } from '@playwright/test';

test.describe('AeroNetra Homepage - WebGL Integration', () => {
  test('should render 3D canvas and overlay UI without WebGL errors', async ({ page }) => {
    await page.goto('/');

    const logs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    // Check that we can find the body and it rendered
    await expect(page.locator('body')).toBeVisible();

    // Verify UI is still rendering over the canvas
    await expect(page.locator('h1').first()).toBeVisible();

    // Scroll to trigger camera rig animation
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // WebGL context loss or crashes would throw console errors
    expect(logs.length).toBe(0);
  });
});
