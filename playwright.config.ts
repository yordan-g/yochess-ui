import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	fullyParallel: true,
	workers: 3,
	testDir: "./tests",
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				// launchOptions: {
				// 	slowMo: 2000
				// }
			}
		},
		// {
		// 	name: "firefox",
		// 	use: { ...devices["Desktop Firefox"] }
		// },
		// {
		// 	name: "webkit",
		// 	use: { ...devices["Desktop Safari"] }
		// }
	],
	webServer: {
		command: "npm run dev",
		port: 5173,
		reuseExistingServer: !process.env.CI
	}
});
