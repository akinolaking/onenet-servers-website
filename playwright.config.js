const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 20000,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'tests/results.json' }]],
  use: {
    baseURL: 'http://localhost:4321',
    headless: true,
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
    },
  },
  webServer: {
    command: 'node tests/server.js',
    port: 4321,
    reuseExistingServer: false,
    timeout: 10000,
  },
  projects: [
    { name: 'api', use: {} },
  ],
});
