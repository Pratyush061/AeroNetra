import { test, expect } from '@playwright/test';

test.describe('AeroNetra Homepage', () => {
  test('should load without errors and trigger animations', async ({ page }) => {
    await page.goto('/');

    const logs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);

    // Test Hero
    await expect(page.locator('h1').first()).toBeVisible();

    // Test scrolling and triggering GSAP
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    expect(logs.length).toBe(0);
  });
});
