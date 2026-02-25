import 'reflect-metadata';
import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
// Node/Utility Imports
import sql from 'mssql';
import * as dotenv from 'dotenv';
import path from 'node:path';
import fs from 'fs-extra';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  watchForFileChanges: true,
  video: false,
  screenshotsFolder: './cypress/screenshots',
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    dbUser: 'username',
    dbPassword: 'password',
    dbServer: '127.0.0.1',
    port: 61718,
    env: 'qa',
  },
  e2e: {
    allowCypressEnv: true,
    baseUrl: 'https://jsonplaceholder.typicode.com',
    specPattern: ['**/*.feature', 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'],

    async setupNodeEvents(on, config) {
      const env = (process.env.ENV || config.env.env || 'qa').toLowerCase();
      const envPath = path.resolve(process.cwd(), `env/.env.${env}`);
      if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
      }

      // 1. Initialize Cucumber
      await addCucumberPreprocessorPlugin(on, config);

      on(
        'file:preprocessor',
        createBundler({
          plugins: [NodeModulesPolyfillPlugin(), createEsbuildPlugin(config)],
        })
      );

      // 2. Register ALL Tasks (SQL + Azure + Shared Vars)
      let sharedValue: any;

      // cypress.config.ts
      on('task', {
        async queryDb({ db, script, timeout = 30000 }) {
          const env = (config.env.env || 'qa').toLowerCase();

          const dbConfig = {
            server: config.env.dbServer,
            port: Number(config.env.port),
            user: config.env.dbUser,
            password: config.env.dbPassword,
            database: `${db}-${env}`, // THIS MUST MATCH PLAYWRIGHT
            options: {
              encrypt: false, // Localhost/127.0.0.1 usually requires false
              trustServerCertificate: true,
              connectTimeout: 15000,
              requestTimeout: timeout,
            },
            pool: { max: 1, min: 0, idleTimeoutMillis: 30000 },
          };

          // DEBUG: Check this output in your VS Code Terminal
          console.log(`Connecting to: ${dbConfig.database} on ${dbConfig.server}`);

          try {
            const pool = await new sql.ConnectionPool(dbConfig).connect();
            const result = await pool.request().query(script);

            // Mirror the auto-trimming logic from Playwright
            const processedData = result.recordset.map(row => {
              Object.keys(row).forEach(key => {
                if (typeof row[key] === 'string') row[key] = row[key].trim();
              });
              return row;
            });

            await pool.close();
            return processedData;
          } catch (err) {
            console.error('SQL Task Error:', err.message);
            throw err;
          }
        },
      });

      // 3. Clean reports before run
      on('before:run', () => {
        const reportDir = './cypress/reports';
        if (fs.existsSync(reportDir)) fs.emptyDirSync(reportDir);
      });

      return config;
    },
  },
});
