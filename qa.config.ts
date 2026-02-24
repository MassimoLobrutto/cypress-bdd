const { defineConfig: any } = require('cypress')

module.exports = defineConfig({
  // retries: {
  //   runMode: 1
  //   },
  video: false,
  screenshotsFolder: './cypress/screenshots',
  scrollBehavior: 'center',
  chromeWebSecurity: false,
  numTestsKeptInMemory: 1,
  pageLoadTimeout: 120000,
  env: {
    env: 'qa',
    chambersAPI: 'https://api-qa.chambers.com/api/'
  },
  projectId: 'Chambers',
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts')(on, config)
    },
    experimentalMemoryManagement: true,
    baseUrl: 'https://www.chambers.com',
    specPattern: "**/*.feature",
  },
})
