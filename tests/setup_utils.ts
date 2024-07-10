import { type Browser, type BrowserContext, expect, type Page } from "@playwright/test";

export async function mockStartRandomGame(page1: Page, page2: Page) {
	await page1.goto("/");
	await page2.goto("/");
	// page1 is white as he connects first
	await page1.getByRole("link", { name: "Play" }).click();
	await page2.getByRole("link", { name: "Play" }).click();

	/**
	 * Ensures game is loaded for both pages/browser tabs. Alternative could be 'waitFor'.
	 * // await page2.getByTestId("game-container").waitFor({ state: "attached" });
	 * */
	await expect(page2.getByTestId("game-container")).toBeVisible();
}

export async function createContextsAndPages(browser: Browser): Promise<{
	context1: BrowserContext;
	context2: BrowserContext;
	page1: Page;
	page2: Page
}> {
	const context1 = await browser.newContext();
	const context2 = await browser.newContext();
	const page1 = await context1.newPage();
	const page2 = await context2.newPage();
	return { context1, context2, page1, page2 };
}

export async function makeMovesForCheckmate(page1: Page, page2: Page) {
	// page1/player1 is white and is giving a checkmate
	await page1.locator("rect[data-square=\"e2\"]").click();
	await page1.locator("rect[data-square=\"e4\"]").click();

	await page2.locator("rect[data-square=\"f7\"]").click();
	await page2.locator("rect[data-square=\"f5\"]").click();

	await page1.locator("rect[data-square=\"d2\"]").click();
	await page1.locator("rect[data-square=\"d3\"]").click();

	await page2.locator("rect[data-square=\"g7\"]").click();
	await page2.locator("rect[data-square=\"g5\"]").click();

	await page1.locator("rect[data-square=\"d1\"]").click();
	await page1.locator("rect[data-square=\"h5\"]").click();
}
