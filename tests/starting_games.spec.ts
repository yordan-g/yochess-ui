import { test, expect, type Page, type Browser, type BrowserContext } from "@playwright/test";
import { createContextsAndPages, makeMovesForCheckmate, mockStartRandomGame } from "./setup_utils";

// Each group can override the settings for itself.
// Set a default retry of 2. Due to the nature of complexity of the tests sometimes PW doesn't run them gracefully the first run. Following runs pass.
test.describe.configure({ mode: "default", timeout: 6000, retries: 2 });

test.describe("Starting Random Game behaviour", () => {
	// Setup 2 different browser sessions as if 2 players are connecting to the website to play.
	let context1: BrowserContext, context2: BrowserContext, page1: Page, page2: Page;

	test.beforeEach(async ({ browser }) => {
		({ context1, context2, page1, page2 } = await createContextsAndPages(browser));
	});

	test.afterEach(async () => {
		await context1.close();
		await context2.close();
	});

	test("WHEN 2 players click to start a game THEN connection works and game starts gracefully", async ({ browser }) => {
		await page1.goto("/");
		await page2.goto("/");

		await expect(page1.getByText("Let's play a quick game of chess!")).toBeVisible();
		await expect(page2.getByText("Let's play a quick game of chess!")).toBeVisible();

		await page1.getByRole("link", { name: "Play" }).click();

		await expect(page1.getByText("Searching for opponent...")).toBeVisible();
		await expect(page1.getByTestId("waiting-for-game-spinner")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeHidden();

		await page2.getByRole("link", { name: "Play" }).click();

		// both players should see the started game with correct layout of elements
		for (const page of [page1, page2]) {
			const { username, userId } = await page.evaluate(() => {
				return {
					username: localStorage.getItem('username'),
					userId: localStorage.getItem('userId')
				}
			});
			expect(username).not.toEqual('');
			expect(userId).toBeTruthy();

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

	test("WHEN a player tries to connect to `/play` route skipping the home page THEN game should not start", async ({ page}) => {
		await page.goto("http://localhost:5173/play");

		await expect(page.getByText("Let's play a quick game of chess!")).toBeVisible();
		await expect(page.getByTestId("waiting-for-game-spinner")).toBeHidden();
		await expect(page.getByTestId("game-container")).toBeHidden();
	});

	test("GIVEN a player has clicked on Friendly Game AND is waiting WHEN he starts a random game THEN new random game should start", async ({ browser}) => {
		await page1.goto("/");
		await page2.goto("/");

		await page1.getByRole("button", { name: "Friendly Game" }).click();
		await expect(page1.getByTestId("friendly-game-link")).toBeVisible();

		await page1.getByRole("link", { name: "Play" }).click();
		await expect(page1.getByTestId("friendly-game-link")).toBeHidden();
		await expect(page1.getByText("Searching for opponent...")).toBeVisible();

		await page2.getByRole("link", { name: "Play" }).click();

		await expect(page1.getByTestId("game-container")).toHaveCount(1);
		await expect(page2.getByTestId("game-container")).toHaveCount(1);
	});
});

// Ending actions and screen is the same for all kind of Games.
test.describe("Ending Game behaviour", () => {
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

	// todo does not work as sveltekit doesn't recognise pw closing a tab
	// test('When one player closes the browser tab', async ({ browser}) => {});

	test("WHEN game ends in checkmate THEN game is stopped AND end dialog displays for both players", async ({ browser }) => {
		await makeMovesForCheckmate(page1, page2);

		for (const page of [page1, page2]) {
			await expect(page.getByTestId("end-game-modal")).toBeVisible();
			await expect(page.getByText("Checkmate! White wins!")).toBeVisible();
			await expect(page.getByText("You can offer rematch or start another game")).toBeVisible();
			await expect(page.getByRole("button", { name: "Close" })).toBeVisible();
			await expect(page.getByRole("button", { name: "Rematch" })).toBeVisible();
			await expect(page.getByRole("button", { name: "Play Again" })).toBeVisible();
		}
	});

	test("WHEN game has ended AND both players click `Play Again` THEN a new game is started", async ({ browser }) => {
		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Play Again" }).click();

		await expect(page1.getByText("Searching for opponent...")).toBeVisible();
		await expect(page1.getByTestId("waiting-for-game-spinner")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeHidden();

		await expect(page2.getByTestId("end-game-modal")).toBeVisible();
		await expect(page2.getByText("Your opponent left the game")).toBeVisible();
		await expect(page2.getByText(ENG_GAME_NOTIFICATION_TEXT)).toBeVisible();

		await page2.getByRole("button", { name: "Play Again" }).click();

		await expect(page2.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeVisible();
	});

	test("WHEN game has ended AND both players click `Rematch` THEN a rematch game is started", async ({ browser }) => {
		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Rematch" }).click();

		await expect(page1.getByTestId("end-game-modal")).toBeVisible();
		await expect(page1.getByText("Waiting for the opponent to accept")).toBeVisible();
		await expect(page2.getByTestId("end-game-modal")).toBeVisible();

		await page2.getByRole("button", { name: "Rematch" }).click();

		await expect(page2.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeVisible();
		// Colors should be switched so 1st player should be with back for the rematch game
		await expect(page1.locator("g[data-square=\"h7\"]")).toHaveAttribute("data-piece", "bp");
	});
});

test.describe("Starting Friendly/Custom Game behaviour", () => {
	test("Should work", async ({ browser}) => {
		let page1: Page, page2: Page;
		({ page1, page2 } = await createContextsAndPages(browser));

		await page1.goto("/");

		await page1.getByRole("button", { name: "Friendly Game" }).click();

		await expect(page1.getByTestId("friendly-game-link")).toBeVisible();
		await expect(page1.getByText("Send the link to you friend. Waiting for him to connect...")).toBeVisible();
		await expect(page1.getByTestId("waiting-for-game-spinner")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeHidden();

		const friendlyGameUrl = await page1.getByTestId("friendly-game-link").textContent();
		await page2.goto(friendlyGameUrl!);

		await expect(page2.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("friendly-game-link")).toBeHidden();
		await expect(page2.getByTestId("friendly-game-link")).toBeHidden();
	});
});

test.describe("Consecutively starting multiple games should work normally in order", () => {
	test.describe.configure({ timeout: 8000 });
	let context1: BrowserContext, context2: BrowserContext, page1: Page, page2: Page;

	test.beforeEach(async ({ browser }) => {
		({ context1, context2, page1, page2 } = await createContextsAndPages(browser));
		await mockStartRandomGame(page1, page2);
	});

	test.afterEach(async () => {
		await context1.close();
		await context2.close();
	});

	test("1. Random 2. Random 3. Random", async ({ browser }) => {
		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Play Again" }).click();
		await page2.getByRole("button", { name: "Play Again" }).click();

		await expect(page2.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeVisible();

		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Play Again" }).click();
		await page2.getByRole("button", { name: "Play Again" }).click();

		await expect(page2.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeVisible();
	});

	test("1. Random 2. Rematch 3. Random", async ({ browser }) => {
		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Rematch" }).click();
		await page2.getByRole("button", { name: "Rematch" }).click();

		await expect(page2.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeVisible();

		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Play Again" }).click();
		await page2.getByRole("button", { name: "Play Again" }).click();

		await expect(page2.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeVisible();
	});

	test("1. Random 2. Friendly 3. Random", async ({ browser }) => {
		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Close" }).click();
		await page2.getByRole("button", { name: "Close" }).click();

		await page1.getByRole("button", { name: "Friendly Game" }).click();

		const friendlyGameUrl = await page1.getByTestId("friendly-game-link").textContent();
		await page2.goto(friendlyGameUrl!);

		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Play Again" }).click();
		await page2.getByRole("button", { name: "Play Again" }).click();

		await expect(page2.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeVisible();
	});

	test("1. Random 2. Friendly 3. Rematch", async ({ browser }) => {
		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Close" }).click();
		await page2.getByRole("button", { name: "Close" }).click();

		await page1.getByRole("button", { name: "Friendly Game" }).click();

		const friendlyGameUrl = await page1.getByTestId("friendly-game-link").textContent();
		await page2.goto(friendlyGameUrl!);

		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Rematch" }).click();
		await page2.getByRole("button", { name: "Rematch" }).click();

		await expect(page2.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeVisible();
	});

	test("1. Random 2. Rematch 3. Friendly", async ({ browser }) => {
		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Rematch" }).click();
		await page2.getByRole("button", { name: "Rematch" }).click();

		await expect(page2.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeVisible();

		await makeMovesForCheckmate(page1, page2);

		await page1.getByRole("button", { name: "Close" }).click();
		await page2.getByRole("button", { name: "Close" }).click();

		await page1.getByRole("button", { name: "Friendly Game" }).click();

		const friendlyGameUrl = await page1.getByTestId("friendly-game-link").textContent();
		await page2.goto(friendlyGameUrl!);

		await expect(page2.getByTestId("game-container")).toBeVisible();
		await expect(page1.getByTestId("game-container")).toBeVisible();
	});
});
