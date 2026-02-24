import "reflect-metadata"; // MUST BE LINE 1
import { defineConfig } from "cypress";
// We use 'import' instead of 'require' for the config file in v14
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  watchForFileChanges: true,
  video: false,
  modifyObstructiveCode: false,
  screenshotsFolder: "./cypress/screenshots",
  scrollBehavior: "center",
  chromeWebSecurity: false,
  numTestsKeptInMemory: 0,
  pageLoadTimeout: 200000,
  env: {
    env: "www",
    myAccOrgId: 1337145,
    chambersAPI: "https://api-uat.chambers.com/api/",
    profilesPortalAPI: "https://profiles-portal-uat.chambers.com/",
    rankingsAPI: "https://ranking-tables-uat.chambers.com/",
    subsectionId: 505532,
    publicationId: 477,
    locationId: 11805,
    departmentOnlyLocationId: 11814,
    practiceAreaId: 1,
    paidPracticeAreaId: 11,
    departmentOnlyPracticeAreaId: 2948,
    subsectionTypeId: 1,
    publicationTypeGroupId: 1,
    paidPublicationTypeGroupId: 7,
    researchScheduleId: 513257,
    personOrganisationId: 147,
    paidPersonOrganisationId: 260591,
    organisationId: 31,
    paidOrganisationId: 138533,
    individualsId: 357417,
    articlesId: "34040000000093039",
    topicId: "34040000000129050",
    count: 7,
    regionTestJurisdiction: "USA",
    emailTemplateId: "d-7c9a4bc85be743ba986091cdf5c48473",
    submissionTestOrg: 309,
    refInsightsOrg: 171684,
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    baseUrl: "https://uat.chambers.com",
    specPattern: ["**/*.feature", "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}"],

    // v14 requires setupNodeEvents to be async for the preprocessor to initialize
    async setupNodeEvents(on, config) {
      on("before:run", () => {
        const reportDir = "./cypress/reports"; // adjust path to your folder name
        if (fs.existsSync(reportDir)) {
          fs.rmSync(reportDir, { recursive: true, force: true });
          console.log(`--- Cleaned out old reports in ${reportDir} ---`);
        }
      });
      // Initialize Cucumber preprocessor
      await addCucumberPreprocessorPlugin(on, config);

      // Set up the esbuild bundler (replaces the need for a separate plugins/index.ts usually)
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      );

      // If you have extra SQL or task logic in plugins/index.ts, keep this:
      // return require('./cypress/plugins/index.ts')(on, config);

      return config;
    },
  },
});
