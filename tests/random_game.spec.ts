import { test, expect, type Page, type Browser, type BrowserContext } from "@playwright/test";

test.describe.configure({ mode: "default" });

test.describe("Staring a game", () => {
	test("WHEN 2 users click to start a game THEN connection works and game starts gracefully", async ({ browser }) => {
		// Setup 2 different browser sessions as if 2 users are connecting to the website to play.
		let page1: Page, page2: Page;
		({ page1, page2 } = await createContextsAndPages(browser));

		await page1.goto("/");
		await page2.goto("/");

		await expect(page1.getByText("About")).toBeVisible();
		await expect(page2.getByText("About")).toBeVisible();

		await page1.getByRole("link", { name: "Play" }).click();
		await page1.locator(".spinner").waitFor({ state: "attached" });

		await expect(page1.getByText("Searching for opponent...")).toBeVisible();
		await expect(page1.locator(".spinner")).toBeVisible();
		await expect(page1.locator(".game-c")).toBeHidden();

		await page2.getByRole("link", { name: "Play" }).click();
		await page1.locator(".game-c").waitFor({ state: "attached" });

		// both users should see the started game with correct layout of elements
		for (const page of [page1, page2]) {
			await expect(page.locator(".play-c")).toHaveCount(1);
			await expect(page.locator(".game-c")).toHaveCount(1);
			await expect(page.locator(".chat-c")).toHaveCount(1);

			await expect(page.locator(".player-info")).toHaveCount(2);
			await expect(page.locator(".user-c")).toHaveCount(2);
			await expect(page.locator(".time-c")).toHaveCount(2);
			await expect(page.locator(".pieces-c")).toHaveCount(2);

			await expect(page.locator(".game-c > :nth-child(2)")).toHaveClass(RegExp(/.*board.*/));
		}

		// Move white pawn
		await page1.locator("rect[data-square=\"a2\"]").click();
		await page1.locator("rect[data-square=\"a4\"]").click();

		// Assert if ws connection is working, both users should see the pawn move.
		await expect(page1.locator("g[data-square=\"a4\"]")).toHaveAttribute("data-piece", "wp");
		await expect(page2.locator("g[data-square=\"a4\"]")).toHaveAttribute("data-piece", "wp");
	});
});

test.describe("Ending a game", () => {
	let context1: BrowserContext, context2: BrowserContext, page1: Page, page2: Page;
	const ENG_GAME_NOTIFICATION_TEXT = "Game ended, you can start another one!";

	test.beforeEach(async ({ browser }) => {
		({ context1, context2, page1, page2 } = await createContextsAndPages(browser));
		await mockStartRandomGame(page1, page2);
	});

	test.afterEach(async () => {
		await context1.close();
		await context2.close();
	});

	test("WHEN one user navigates out of the game url THEN the other should see end game notification", async ({ browser }) => {
		await page2.getByRole("link", { name: "About" }).click();
		await page1.locator(".notification").waitFor({ state: "attached" });
		await expect(page1.locator(".notification")).toContainText(ENG_GAME_NOTIFICATION_TEXT);

		// Move white pawn
		await page1.locator("rect[data-square=\"a2\"]").click();
		await page1.locator("rect[data-square=\"a4\"]").click();

		// Assert if ws connection has closed, the user still in game should not be able to move the pawn.
		await expect(page1.locator("g[data-square=\"a2\"]")).toHaveAttribute("data-piece", "wp");
	});

	test("WHEN one user clicks browsers back button THEN the other should see end game notification", async ({ browser }) => {
		await page2.goBack();
		await page1.locator(".notification").waitFor({ state: "attached" });
		await expect(page1.locator(".notification")).toContainText(ENG_GAME_NOTIFICATION_TEXT);
	});

	// todo does not work as sveltekit doesn't recognise pw closing a tab
	// test('When one user closes the browser tab', async ({ browser}) => {});
});

async function mockStartRandomGame(page1: Page, page2: Page) {
	await page1.goto("/");
	await page2.goto("/");
	// page1 is white as he connects first
	await page1.getByRole("link", { name: "Play" }).click();
	await page2.getByRole("link", { name: "Play" }).click();

	await page2.locator(".game-c").waitFor({ state: "attached" });
}

async function createContextsAndPages(browser: Browser): Promise<{ context1: BrowserContext; context2: BrowserContext; page1: Page; page2: Page }> {
	const context1 = await browser.newContext();
	const context2 = await browser.newContext();
	const page1 = await context1.newPage();
	const page2 = await context2.newPage();
	await page1.setViewportSize({ width: 1400, height: 1000 });
	await page2.setViewportSize({ width: 1400, height: 1000 });
	return { context1, context2, page1, page2 };
}
