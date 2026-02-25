// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload';
import 'cypress-iframe';
require('cypress-downloadfile/lib/downloadFileCommand');
import 'cypress-real-events/support';

// cypress/support/commands.ts

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to query the MS SQL database.
       */
      queryDb(db: string, script: string, timeout?: number): Chainable<any>;
    }
  }
}

Cypress.Commands.add('queryDb', (db: string, script: string, timeout = 30000) => {
  // Return the entire chain so Cypress knows to wait for the task to finish
  return cy.task('queryDb', { db, script, timeout }).then(result => {
    // We log the result, but we don't 'return' anything manually here
    // Cypress automatically passes the 'result' to the next link in the chain
    cy.log(`🗄️ DB: ${db} | Rows returned: ${Array.isArray(result) ? result.length : 0}`);

    // By wrapping the result, you make it available for the next .then() in your test
    cy.wrap(result);
  });
});

export enum databaseName {
  shieldfaculty = 'shieldfaculty',
  shieldstudent = 'shieldstudent',
}

import 'cypress-wait-until';

Cypress.Commands.add('findByRegexRole', (role: any, name: string, options = {}) => {
  // This logic is now hidden away and reusable
  const smartRegex = new RegExp(`^${name.replaceAll(/\s+/g, '\\s+')}`, 'i');

  return cy.findByRole(role, { name: smartRegex, ...options });
});

// Optional: Add the "All" version too
Cypress.Commands.add('findAllByRegExRole', (role: any, name: string, options = {}) => {
  const smartRegex = new RegExp(`^${name.replaceAll(/\s+/g, '\\s+')}`, 'i');

  return cy.findAllByRole(role, { name: smartRegex, ...options });
});
