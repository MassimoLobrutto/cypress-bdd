const { defineConfig } = require('cypress')

module.exports = defineConfig({
  retries: {
    runMode: 1
  },
  video: false,
  experimentalMemoryManagement: true,
  modifyObstructiveCode: false,
  screenshotsFolder: './cypress/screenshots',
  scrollBehavior: 'center',
  chromeWebSecurity: false,
  numTestsKeptInMemory: 0,
  pageLoadTimeout: 80000,
  env: {
    env: 'uat',
    chambersAPI: 'https://api-uat.chambers.com/api/'
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
