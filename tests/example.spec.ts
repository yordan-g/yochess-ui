import { test, expect } from '@playwright/test';

test('Home page is loading', async ({ page }) => {
	await page.goto('/');

	// await page.pause();

	await expect(page.getByText('About')).toBeVisible();
});
