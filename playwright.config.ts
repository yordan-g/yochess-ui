import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				launchOptions: {
					slowMo: 2000
				}
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
