import { test, expect } from '@playwright/test';

test('Simulate two users starting a random game', async ({ browser }) => {
	// Setup 2 different browser sessions as if 2 users are connecting to the website to play.
	const context1 = await browser.newContext();
	const context2 = await browser.newContext();
	const page1 = await context1.newPage();
	const page2 = await context2.newPage();

	await page1.goto('/');
	await page2.goto('/');

	await expect(page1.getByText('About')).toBeVisible();
	await expect(page2.getByText('About')).toBeVisible();

	await page1.getByRole('link', { name: 'Play' }).click();

	await expect(page1.getByText('Searching for opponent...')).toBeVisible();
	await expect(page1.locator('.spinner')).toBeVisible();
	await expect(page1.locator('.game-c')).toBeHidden();

	await page2.getByRole('link', { name: 'Play' }).click();

	// both users should see the started game
	for (const page of [page1, page2]) {
		await expect(page.locator('.play-c')).toHaveCount(1);
		await expect(page.locator('.game-c')).toHaveCount(1);
		await expect(page.locator('.chat-c')).toHaveCount(1);

		await expect(page.locator('.player-info')).toHaveCount(2);
		await expect(page.locator('.user-c')).toHaveCount(2);
		await expect(page.locator('.time-c')).toHaveCount(2);
		await expect(page.locator('.pieces-c')).toHaveCount(2);

		await expect(page.locator('.game-c > :nth-child(2)')).toHaveClass(RegExp(/.*board.*/));
	}
});
