import { test, expect, type Page, type Browser, type BrowserContext } from "@playwright/test";

test.describe.configure({ mode: "default", timeout: 5000 });

test.describe("Staring a game", () => {
	test.describe.configure({ retries: 2 });

	test("WHEN 2 players click to start a game THEN connection works and game starts gracefully", async ({ browser }) => {
		// Setup 2 different browser sessions as if 2 players are connecting to the website to play.
		let page1: Page, page2: Page;
		({ page1, page2 } = await createContextsAndPages(browser));

		await page1.goto("/");
		await page2.goto("/");

		await expect(page1.getByText("About")).toBeVisible();
		await expect(page2.getByText("About")).toBeVisible();

		await page1.getByRole("link", { name: "Play" }).click();

		await expect(page1.getByText("Searching for opponent...")).toBeVisible();
		await expect(page1.getByTestId("waiting-for-game-spinner")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeHidden();

		await page2.getByRole("link", { name: "Play" }).click();

		// both players should see the started game with correct layout of elements
		for (const page of [page1, page2]) {
			await expect(page.getByTestId("play-container")).toHaveCount(1);
			await expect(page.getByTestId("chat-container")).toHaveCount(1);

			await expect(page.getByTestId("game-container")).toHaveCount(1);
			await expect(page.getByTestId("player-info-container")).toHaveCount(2);
			await expect(page.getByTestId("player-name")).toHaveCount(2);
			await expect(page.getByTestId("time-left")).toHaveCount(2);
			await expect(page.getByTestId("pieces-taken")).toHaveCount(2);

			await expect(page.getByTestId("chessboard")).toBeVisible();
		}

		// Move white pawn
		await page1.locator("rect[data-square=\"a2\"]").click();
		await page1.locator("rect[data-square=\"a4\"]").click();

		// Assert if ws connection is working, both players should see the pawn move.
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

	test("WHEN one player navigates out of the game url THEN the other should see end game notification", async ({ browser }) => {
		await page2.getByRole("link", { name: "About" }).click();
		await expect(page1.getByTestId("end-game-notification")).toContainText(ENG_GAME_NOTIFICATION_TEXT);

		// Move white pawn
		await page1.locator("rect[data-square=\"a2\"]").click();
		await page1.locator("rect[data-square=\"a4\"]").click();

		// Assert if ws connection has closed, the player still in game should not be able to move the pawn.
		await expect(page1.locator("g[data-square=\"a2\"]")).toHaveAttribute("data-piece", "wp");
	});

	test("WHEN one player clicks browsers back button THEN the other should see end game notification", async ({ browser }) => {
		await page2.goBack();
		await expect(page1.getByTestId("end-game-notification")).toContainText(ENG_GAME_NOTIFICATION_TEXT);
	});

	test("WHEN game ends in checkmate THEN game is stopped AND end dialog displays for both players", async ({ browser }) => {
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

		for (const page of [page1, page2]) {
			await expect(page.getByTestId("end-game-modal")).toBeVisible();
			await expect(page.getByText("Checkmate! White wins!")).toBeVisible();
			await expect(page.getByText("You can offer rematch or start another game!")).toBeVisible();
			await expect(page.getByRole("button", { name: "Close" })).toBeVisible();
			await expect(page.getByRole("button", { name: "Rematch" })).toBeVisible();
			await expect(page.getByText("Play Again")).toBeVisible(); // button could not be matched by role and text
		}
	});

	// todo does not work as sveltekit doesn't recognise pw closing a tab
	// test('When one player closes the browser tab', async ({ browser}) => {});
});

async function mockStartRandomGame(page1: Page, page2: Page) {
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

async function createContextsAndPages(browser: Browser): Promise<{
	context1: BrowserContext;
	context2: BrowserContext;
	page1: Page;
	page2: Page
}> {
	const context1 = await browser.newContext();
	const context2 = await browser.newContext();
	const page1 = await context1.newPage();
	const page2 = await context2.newPage();
	await page1.setViewportSize({ width: 1400, height: 1000 });
	await page2.setViewportSize({ width: 1400, height: 1000 });
	return { context1, context2, page1, page2 };
}
