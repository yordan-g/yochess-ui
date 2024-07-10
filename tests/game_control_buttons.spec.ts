import { type BrowserContext, expect, type Page, test } from "@playwright/test";
import { createContextsAndPages, mockStartRandomGame } from "./setup_utils";

test.describe.configure({ mode: "default", timeout: 6000, retries: 2 });

test.describe.only("In game Controls", () => {
	let context1: BrowserContext, context2: BrowserContext, page1: Page, page2: Page;

	test.beforeEach(async ({ browser }) => {
		({ context1, context2, page1, page2 } = await createContextsAndPages(browser));
		await mockStartRandomGame(page1, page2);
	});

	test.afterEach(async () => {
		await context1.close();
		await context2.close();
	});

	test("WHEN player 1 offers a draw THEN player 2 sees a dialog to accept AND after accept end modal is displayed", async ({ browser }) => {
		// p1 offers a draw
		await page1.getByRole("button", { name: "Offer draw" }).click();
		await expect(page2.getByTestId("draw-content-info")).toBeVisible();
		await expect(page2.getByRole("button", { name: "Accept" })).toBeVisible();
		await expect(page2.getByRole("button", { name: "Deny" })).toBeVisible();
		await expect(page1.getByTestId("draw-content-info")).toBeHidden();

		// p2 denies
		await page2.getByRole("button", { name: "Deny" }).click();
		await expect(page1.getByTestId("draw-content-info")).toBeHidden();
		await expect(page2.getByTestId("draw-content-info")).toBeHidden();

		// p1 offers again and p2 accepts
		await page1.getByRole("button", { name: "Offer draw" }).click();
		await page2.getByRole("button", { name: "Accept" }).click();

		for (const page of [page1, page2]) {
			await expect(page.getByTestId("end-game-modal")).toBeVisible();
			await expect(page.getByText("It's a Draw!")).toBeVisible();
			await expect(page.getByText("You can offer rematch or start another game")).toBeVisible();
		}
	});

	test("WHEN player 1 clicks Resign THEN he sees resign dialog AND after confirm end modal is displayed", async ({ browser }) => {
		// p1 offers a draw
		await page1.getByRole("button", { name: "Resign" }).click();
		await expect(page1.getByTestId("resign-content-info")).toBeVisible();
		await expect(page1.getByText("Are you sure you want to resign?")).toBeVisible();
		await expect(page1.getByRole("button", { name: "Confirm" })).toBeVisible();
		await expect(page1.getByRole("button", { name: "Cancel" })).toBeVisible();
		await expect(page2.getByTestId("resign-content-info")).toBeHidden();

		// p1 cancels
		await page1.getByRole("button", { name: "Cancel" }).click();
		await expect(page1.getByTestId("resign-content-info")).toBeHidden();

		// p1 resigns again and confirms
		await page1.getByRole("button", { name: "Resign" }).click();
		await page1.getByRole("button", { name: "Confirm" }).click();

		for (const page of [page1, page2]) {
			await expect(page.getByTestId("resign-content-info")).toBeHidden();
			await expect(page.getByTestId("end-game-modal")).toBeVisible();
			await expect(page.getByText("Change! resigned! Black wins!")).toBeVisible();
			await expect(page.getByText("You can offer rematch or start another game")).toBeVisible();
		}
	});
});
