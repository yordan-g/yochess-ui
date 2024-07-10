import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	fullyParallel: false,
	workers: 1,
	testDir: "./tests",
	projects: [
		{
			name: "Desktop Chromium",
			use: {
				browserName: 'chromium',
				...devices["Desktop Chrome"],
				// viewport: { width: 1400, height: 1000 }
			}
		},
		{
			name: 'Mobile Chromium',
			use: {
				browserName: 'chromium',
				...devices['iPhone 14 Plus'],
			},
		},
	],
	webServer: {
		command: "npm run dev",
		port: 5173,
		reuseExistingServer: !process.env.CI
	}
});
